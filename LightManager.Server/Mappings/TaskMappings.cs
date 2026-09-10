/*
 * File: Mappings/TaskMappings.cs
 * Purpose: Centralizes TaskModel to TaskDetailDTO mapping for EF Core projections and in-memory entities.
 * Members: ToDetailDtoExpression, ToDetailDto.
 */

using System.Linq.Expressions;
using LightManager.Server.DTOs;
using LightManager.Server.Models;

namespace LightManager.Server.Mappings;

public static class TaskMappings
{
    public static readonly Expression<Func<TaskModel, TaskDetailDTO>> ToDetailDtoExpression = task =>
        new TaskDetailDTO
        {
            Id = task.Id,
            Title = task.Title,
            Description = task.Description,
            Status = task.Status,
            Priority = task.Priority,
            DueDate = task.DueDate,
            CreatedAt = task.CreatedAt,
            UpdatedAt = task.UpdatedAt,
            CompletedAt = task.CompletedAt
        };

    private static readonly Func<TaskModel, TaskDetailDTO> ToDetailDtoFunc =
        ToDetailDtoExpression.Compile();

    public static TaskDetailDTO ToDetailDto(this TaskModel task)
        => ToDetailDtoFunc(task);
}
