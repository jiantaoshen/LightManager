/*
 * File: Models/TaskModel.cs
 * Purpose: Defines task persistence entities and internal status/priority enums.
 * Types: TaskItemStatus, TaskPriority, TaskModel.
 */

using LightManager.Server.Data;

namespace LightManager.Server.Models;

public enum TaskItemStatus
{
    Todo,
    Done
}

public enum TaskPriority
{
    // API/database values stay stable; the frontend displays these as Non-priority, Priority, and Must.
    Low,
    Medium,
    High
}

public class TaskModel
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public TaskItemStatus Status { get; set; } = TaskItemStatus.Todo;
    public TaskPriority Priority { get; set; } = TaskPriority.Medium;

    // DueDate is a calendar date rather than a timestamp to avoid timezone drift.
    public DateOnly? DueDate { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? CompletedAt { get; set; }

    // Every task belongs directly to one authenticated user.
    public string UserId { get; set; } = string.Empty;
    public ApplicationUser User { get; set; } = null!;
}
