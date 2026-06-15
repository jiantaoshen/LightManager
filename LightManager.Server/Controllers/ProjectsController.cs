using LightManager.Server.Data;
using LightManager.Server.DTOs;
using LightManager.Server.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace LightManager.Server.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class ProjectsController : Controller
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly ApplicationDbContext _context;

        public ProjectsController(UserManager<ApplicationUser> userManager, ApplicationDbContext context)
        {
            _userManager = userManager;
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetProjects()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (string.IsNullOrEmpty(userId))
                return Unauthorized();

            var projects = await _context.Projects
                .Where(p =>
                    p.CreatedByUserId == userId ||                 // Owner
                    p.Members.Any(m => m.UserId == userId)        // Members
                )
                .Select(p => new ProjectsDTO
                {
                    Id = p.Id,
                    Name = p.Name,
                    Owner = p.CreatedByUser.UserName,
                    Status = p.Status,
                    CreatedAt = p.CreatedAt,
                    TotalMembers = p.Members.Count()
                })
                .ToListAsync();

            return Ok(projects);
        }

        [HttpPost]
        public async Task<IActionResult> CreateProject(ProjectDetailDTO dto)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (string.IsNullOrEmpty(userId))
                return Unauthorized("Invalid token");

            var project = new ProjectModel
            {
                Name = dto.Name,
                Description = dto.Description,
                Status = "Active",
                CreatedByUserId = userId,
                CreatedAt = DateTime.UtcNow
            };

            _context.Projects.Add(project);
            await _context.SaveChangesAsync();

            var creatorAsMember = new ProjectMemberModel
            {
                ProjectId = project.Id,
                UserId = userId,
                Role = "Manager",
                JoinedAt = DateTime.UtcNow
            };

            _context.ProjectMembers.Add(creatorAsMember);
            await _context.SaveChangesAsync();

            return Ok(new ProjectDetailDTO
            {
                Id = project.Id,
                Name = project.Name,
                Description = project.Description,
                Status = project.Status
            });
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateProject(int id, ProjectDetailDTO dto)
        {
            var project = await _context.Projects
                .Include(p => p.Members)
                .Include(p => p.CreatedByUser)
                .FirstOrDefaultAsync(p => p.Id == id);

            if (project == null)
                return NotFound();

            // update project
            project.Name = dto.Name;
            project.Description = dto.Description;
            project.Status = dto.Status;

            // SAFETY: prevent null crash
            dto.Members ??= new List<ProjectMemberDTO>();

            // load existing members
            var existing = await _context.ProjectMembers
                .Where(m => m.ProjectId == id)
                .ToListAsync();

            // UPDATE + REMOVE
            foreach (var member in existing)
            {
                if (member.Role == "Owner")
                    continue;

                var updated = dto.Members
                    .FirstOrDefault(x => x.UserId == member.UserId);

                if (updated == null)
                {
                    _context.ProjectMembers.Remove(member);
                }
                else
                {
                    member.Role = updated.Role;
                }
            }

            // ADD NEW MEMBERS
            foreach (var dtoMember in dto.Members)
            {
                var exists = existing.Any(m => m.UserId == dtoMember.UserId);

                if (!exists)
                {
                    _context.ProjectMembers.Add(new ProjectMemberModel
                    {
                        ProjectId = id,
                        UserId = dtoMember.UserId,
                        Role = dtoMember.Role,
                        JoinedAt = DateTime.UtcNow
                    });
                }
            }

            await _context.SaveChangesAsync();

            // reload members safely
            var updatedProject = await _context.Projects
                .Include(p => p.Members)
                .ThenInclude(m => m.User)
                .Include(p => p.CreatedByUser)
                .FirstOrDefaultAsync(p => p.Id == id);

            return Ok(new ProjectDetailDTO
            {
                Id = updatedProject!.Id,
                Name = updatedProject.Name,
                Description = updatedProject.Description,
                Status = updatedProject.Status,
                CreatedAt = updatedProject.CreatedAt,
                Owner = updatedProject.CreatedByUser?.UserName ?? "",

                Members = updatedProject.Members.Select(m => new ProjectMemberDTO
                {
                    UserId = m.UserId,
                    UserName = m.User?.UserName ?? "",
                    Role = m.Role
                }).ToList()
            });
        }

        [HttpGet("{projectId}")]
        public async Task<IActionResult> GetProject(int projectId)
        {
            var project = await _context.Projects
                .Where(p => p.Id == projectId)
                .Select(p => new ProjectDetailDTO
                {
                    Id = p.Id,
                    Name = p.Name,
                    Description = p.Description,
                    Members = p.Members.Select(m => new ProjectMemberDTO
                    {
                        UserId = m.UserId,
                        UserName = m.User.UserName,
                        Role = m.Role
                    }).ToList()
                })
                .FirstOrDefaultAsync();

            if (project == null)
                return NotFound();

            return Ok(project);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProject(int id)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            var project = await _context.Projects
                .Include(p => p.Members)
                .FirstOrDefaultAsync(p => p.Id == id);

            if (project == null)
                return NotFound();

            // only allow creator/admin
            if (project.CreatedByUserId != userId)
                return Forbid();

            // delete members first (important because of FK restrict)
            _context.ProjectMembers.RemoveRange(project.Members);

            _context.Projects.Remove(project);

            await _context.SaveChangesAsync();

            return Ok(new { message = "Project deleted" });
        }
    }
}
