/*
 * File: DTOs/CreateTaskDTO.cs
 * Purpose: Defines validated input for creating a personal task.
 * Type: CreateTaskDTO.
 */

using System.ComponentModel.DataAnnotations;
using LightManager.Server.Models;

namespace LightManager.Server.DTOs;

public class CreateTaskDTO
{
    [Required]
    [StringLength(200)]
    public string Title { get; set; } = string.Empty;

    [StringLength(4000)]
    public string? Description { get; set; }

    public TaskPriority Priority { get; set; } = TaskPriority.Medium;
    public DateOnly? DueDate { get; set; }
}
