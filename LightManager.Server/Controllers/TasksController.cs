using LightManager.Server.Data;
using LightManager.Server.DTOs;
using LightManager.Server.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace LightManager.Server.Controllers
{
    [ApiController]
    [Route("api/projects/{projectId}/tasks")]
    public class TasksController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public TasksController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetTasks(int projectId)
        {
            var tasks = await _context.Tasks
                .Include(t => t.AssignedUsers)
                    .ThenInclude(tu => tu.User)
                .Where(t => t.ProjectId == projectId)
                .Select(t => new TaskDetailDTO
                {
                    Id = t.Id,
                    Title = t.Title,
                    Description = t.Description,
                    Status = t.Status,
                    Priority = t.Priority,
                    DueDate = t.DueDate,

                    AssignedUsers = t.AssignedUsers
                        .Select(u => new TaskUserDTO
                        {
                            UserId = u.UserId,
                            UserName = u.User.UserName
                        }).ToList()
                })
                .ToListAsync();

            return Ok(tasks);
        }

        [HttpPost]
        public async Task<IActionResult> CreateTask(int projectId, CreateTaskDTO dto)
        {
            var task = new TaskModel
            {
                Title = dto.Title,
                Description = dto.Description,
                Status = dto.Status,
                Priority = dto.Priority,
                ProjectId = projectId,
                DueDate = dto.DueDate
            };

            _context.Tasks.Add(task);
            await _context.SaveChangesAsync();

            // add users
            if (dto.AssignedUsers != null)
            {
                foreach (var user in dto.AssignedUsers)
                {
                    _context.Set<TaskAssigneeModel>().Add(new TaskAssigneeModel
                    {
                        TaskId = task.Id,
                        UserId = user.UserId
                    });
                }

                await _context.SaveChangesAsync();
            }

            return Ok(new TaskDetailDTO
            {
                Id = task.Id,
                Title = task.Title,
                Description = task.Description,
                Status = task.Status,
                Priority = task.Priority,
                DueDate = task.DueDate,
                AssignedUsers = dto.AssignedUsers ?? new()
            });
        }

        [HttpPut("{taskId}")]
        public async Task<IActionResult> UpdateTask(int projectId, int taskId, TaskDetailDTO dto)
        {
            var task = await _context.Tasks
                .Include(t => t.AssignedUsers)
                .FirstOrDefaultAsync(t => t.Id == taskId);

            if (task == null) return NotFound();

            task.Title = dto.Title;
            task.Description = dto.Description;
            task.Status = dto.Status;
            task.Priority = dto.Priority;
            task.DueDate = dto.DueDate;

            // remove old users
            _context.RemoveRange(task.AssignedUsers);

            // add new users
            task.AssignedUsers = dto.AssignedUsers.Select(u => new TaskAssigneeModel
            {
                TaskId = task.Id,
                UserId = u.UserId
            }).ToList();

            await _context.SaveChangesAsync();

            return Ok(dto);
        }

        [HttpDelete("{taskId}")]
        public async Task<IActionResult> DeleteTask(int projectId, int taskId)
        {
            var assignees = _context.TaskAssignees
                .Where(x => x.TaskId == taskId);

            _context.TaskAssignees.RemoveRange(assignees);

            var task = await _context.Tasks.FindAsync(taskId);
            if (task == null) return NotFound();

            _context.Tasks.Remove(task);

            await _context.SaveChangesAsync();

            return Ok();
        }
    }
}
