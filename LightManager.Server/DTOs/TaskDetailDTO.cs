/*
 * File: DTOs/TaskDetailDTO.cs
 * Purpose: Defines the task representation returned by authenticated and Trial task endpoints.
 * Type: TaskDetailDTO.
 */

using LightManager.Server.Models;

namespace LightManager.Server.DTOs;

public class TaskDetailDTO
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public TaskItemStatus Status { get; set; }
    public TaskPriority Priority { get; set; }
    public DateOnly? DueDate { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public DateTime? CompletedAt { get; set; }
}
