using LightManager.Server.Data;
using LightManager.Server.DTOs;
using LightManager.Server.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

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
                    p.CreatedByUserId == userId ||                 // Manager
                    p.Members.Any(m => m.UserId == userId)        // Member
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
            });
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateProject(int id, ProjectDetailDTO dto)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            var project = await _context.Projects
                .Include(p => p.Members)
                .FirstOrDefaultAsync(p => p.Id == id);

            if (project == null)
                return NotFound();

            // optional security: only manager/admin can edit
            var currentUserRole = project.Members
                .FirstOrDefault(m => m.UserId == userId)?.Role;

            if (currentUserRole != "Manager")
                return Forbid();

            project.Name = dto.Name;
            project.Description = dto.Description;

            await _context.SaveChangesAsync();

            return Ok(new ProjectDetailDTO
            {
                Id = project.Id,
                Name = project.Name,
                Description = project.Description
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

        [HttpPost("{projectId}/members")]
        public async Task<IActionResult> AddMember(int projectId, AddMemberDTO dto)
        {
            var project = await _context.Projects
                .Include(p => p.Members)
                .FirstOrDefaultAsync(p => p.Id == projectId);

            if (project == null)
                return NotFound("Project not found");

            var user = await _userManager.FindByEmailAsync(dto.Email);

            if (user == null)
                return BadRequest("User not found");

            var exists = await _context.ProjectMembers
                .AnyAsync(pm => pm.ProjectId == projectId && pm.UserId == user.Id);

            if (exists)
                return BadRequest("User already in project");

            var member = new ProjectMemberModel
            {
                ProjectId = projectId,
                UserId = user.Id,
                Role = "Member"
            };

            _context.ProjectMembers.Add(member);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                userId = user.Id,
                userName = user.UserName,
                role = "Member"
            });
        }

        [HttpDelete("{projectId}/members/{userId}")]
        public async Task<IActionResult> RemoveMember(int projectId, string userId)
        {
            var member = await _context.ProjectMembers
                .FirstOrDefaultAsync(x =>
                    x.ProjectId == projectId &&
                    x.UserId == userId);

            if (member == null)
                return NotFound("Member not found");

            // prevent removing manager if you want
            if (member.Role == "Manager")
                return BadRequest("Cannot remove manager");

            _context.ProjectMembers.Remove(member);
            await _context.SaveChangesAsync();

            return Ok();
        }
    }
}
