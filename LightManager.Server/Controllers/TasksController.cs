/*
 * File: Controllers/TasksController.cs
 * Purpose: Provides authenticated task CRUD endpoints scoped to the current user.
 * Actions: GetTasks, GetTask, CreateTask, UpdateTask, DeleteTask.
 * Helpers: GetCurrentUserId, NormalizeNullable.
 */

using System.Security.Claims;
using LightManager.Server.Data;
using LightManager.Server.DTOs;
using LightManager.Server.Mappings;
using LightManager.Server.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace LightManager.Server.Controllers;

[Authorize]
[ApiController]
[Route("api/tasks")]
public class TasksController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public TasksController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<List<TaskDetailDTO>>> GetTasks(
        [FromQuery] DateOnly? from = null,
        [FromQuery] DateOnly? to = null,
        [FromQuery] bool includeCompleted = true,
        [FromQuery] string? search = null)
    {
        var userId = GetCurrentUserId();
        if (userId is null) return Unauthorized();

        var query = _context.Tasks
            .AsNoTracking()
            .Where(task => task.UserId == userId);

        if (from.HasValue)
            query = query.Where(task => task.DueDate >= from.Value);

        if (to.HasValue)
            query = query.Where(task => task.DueDate <= to.Value);

        if (!includeCompleted)
            query = query.Where(task => task.Status != TaskItemStatus.Done);

        if (!string.IsNullOrWhiteSpace(search))
        {
            var term = search.Trim();
            query = query.Where(task =>
                task.Title.Contains(term) ||
                (task.Description != null && task.Description.Contains(term)));
        }

        var tasks = await query
            .OrderBy(task => task.DueDate == null)
            .ThenBy(task => task.DueDate)
            .ThenByDescending(task => task.CreatedAt)
            .Select(TaskMappings.ToDetailDtoExpression)
            .ToListAsync();

        return Ok(tasks);
    }

    [HttpGet("{taskId:int}")]
    public async Task<ActionResult<TaskDetailDTO>> GetTask(int taskId)
    {
        var userId = GetCurrentUserId();
        if (userId is null) return Unauthorized();

        var task = await _context.Tasks
            .AsNoTracking()
            .Where(task => task.Id == taskId && task.UserId == userId)
            .Select(TaskMappings.ToDetailDtoExpression)
            .FirstOrDefaultAsync();

        return task is null ? NotFound() : Ok(task);
    }

    [HttpPost]
    public async Task<ActionResult<TaskDetailDTO>> CreateTask(CreateTaskDTO dto)
    {
        var userId = GetCurrentUserId();
        if (userId is null) return Unauthorized();

        var title = dto.Title.Trim();
        if (title.Length == 0)
            return BadRequest(new { message = "Title is required." });

        var now = DateTime.UtcNow;
        var task = new TaskModel
        {
            Title = title,
            Description = NormalizeNullable(dto.Description),
            Status = TaskItemStatus.Todo,
            Priority = dto.Priority,
            DueDate = dto.DueDate,
            UserId = userId,
            CreatedAt = now,
            UpdatedAt = now
        };

        _context.Tasks.Add(task);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetTask), new { taskId = task.Id }, task.ToDetailDto());
    }

    [HttpPut("{taskId:int}")]
    public async Task<ActionResult<TaskDetailDTO>> UpdateTask(int taskId, UpdateTaskDTO dto)
    {
        var userId = GetCurrentUserId();
        if (userId is null) return Unauthorized();

        var task = await _context.Tasks
            .FirstOrDefaultAsync(task => task.Id == taskId && task.UserId == userId);

        if (task is null) return NotFound();

        var title = dto.Title.Trim();
        if (title.Length == 0)
            return BadRequest(new { message = "Title is required." });

        var wasDone = task.Status == TaskItemStatus.Done;
        var isDone = dto.Status == TaskItemStatus.Done;

        task.Title = title;
        task.Description = NormalizeNullable(dto.Description);
        task.Status = dto.Status;
        task.Priority = dto.Priority;
        task.DueDate = dto.DueDate;
        task.UpdatedAt = DateTime.UtcNow;

        if (!wasDone && isDone)
            task.CompletedAt = DateTime.UtcNow;
        else if (wasDone && !isDone)
            task.CompletedAt = null;

        await _context.SaveChangesAsync();

        return Ok(task.ToDetailDto());
    }

    [HttpDelete("{taskId:int}")]
    public async Task<IActionResult> DeleteTask(int taskId)
    {
        var userId = GetCurrentUserId();
        if (userId is null) return Unauthorized();

        var task = await _context.Tasks
            .FirstOrDefaultAsync(task => task.Id == taskId && task.UserId == userId);

        if (task is null) return NotFound();

        _context.Tasks.Remove(task);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    private string? GetCurrentUserId()
        => User.FindFirstValue(ClaimTypes.NameIdentifier);

    private static string? NormalizeNullable(string? value)
        => string.IsNullOrWhiteSpace(value) ? null : value.Trim();
}
