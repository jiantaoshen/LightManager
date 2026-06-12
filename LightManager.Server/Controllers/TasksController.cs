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
                .Include(t => t.AssignedUser)
                .Where(t => t.ProjectId == projectId)
                .Select(t => new
                {
                    t.Id,
                    t.Title,
                    t.Description,
                    t.Status,
                    t.Priority,
                    t.ProjectId,
                    t.AssignedUserId,

                    AssignedUserName =
                        t.AssignedUser != null
                        ? t.AssignedUser.UserName
                        : null
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
                AssignedUserId = dto.AssignedUserId
            };

            _context.Tasks.Add(task);
            await _context.SaveChangesAsync();

            return Ok(task);
        }

        [HttpPut("{taskId}")]
        public async Task<IActionResult> UpdateTask(int projectId, int taskId, CreateTaskDTO dto)
        {
            var task = await _context.Tasks.FindAsync(taskId);
            if (task == null) return NotFound();

            task.Title = dto.Title;
            task.Description = dto.Description;
            task.Status = dto.Status;
            task.Priority = dto.Priority;
            task.AssignedUserId = dto.AssignedUserId;

            await _context.SaveChangesAsync();
            return Ok(task);
        }

        [HttpDelete("{taskId}")]
        public async Task<IActionResult> DeleteTask(int projectId, int taskId)
        {
            var task = await _context.Tasks.FindAsync(taskId);
            if (task == null) return NotFound();

            _context.Tasks.Remove(task);
            await _context.SaveChangesAsync();
            return Ok();
        }
    }
}
