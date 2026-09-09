using LightManager.Server.Data;

namespace LightManager.Server.Models;

public enum TaskItemStatus
{
    Todo,
    Done
}

public enum TaskPriority
{
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

    // A calendar date, not a moment in time. This avoids timezone drift
    // when the same task is opened from web and mobile clients.
    public DateOnly? DueDate { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    public DateTime? CompletedAt { get; set; }

    // Every task belongs directly to one authenticated user.
    public string UserId { get; set; } = string.Empty;

    public ApplicationUser User { get; set; } = null!;
}
