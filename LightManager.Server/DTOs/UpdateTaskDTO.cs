/*
 * File: DTOs/UpdateTaskDTO.cs
 * Purpose: Defines validated input for replacing an existing task's editable fields.
 * Type: UpdateTaskDTO.
 */

using System.ComponentModel.DataAnnotations;
using LightManager.Server.Models;

namespace LightManager.Server.DTOs;

public class UpdateTaskDTO
{
    [Required]
    [StringLength(200)]
    public string Title { get; set; } = string.Empty;

    [StringLength(4000)]
    public string? Description { get; set; }

    public TaskItemStatus Status { get; set; } = TaskItemStatus.Todo;
    public TaskPriority Priority { get; set; } = TaskPriority.Medium;
    public DateOnly? DueDate { get; set; }
}
