/**
 * File: services/taskService.ts
 * Purpose: Wraps authenticated task CRUD calls and the public read-only Trial task endpoint.
 * Functions: getTasks, createTask, updateTask, deleteTask, getTrialTasks.
 */

import type { PersonalTaskDraft, Task } from "../interfaces/ITask";
import { apiRequest } from "../lib/api";

export function getTasks(): Promise<Task[]> {
  return apiRequest<Task[]>("/api/tasks", { auth: true });
}

export function createTask(draft: PersonalTaskDraft): Promise<Task> {
  return apiRequest<Task>("/api/tasks", {
    method: "POST",
    auth: true,
    json: true,
    body: JSON.stringify(draft),
  });
}

export function updateTask(taskId: number, task: Task): Promise<Task> {
  return apiRequest<Task>(`/api/tasks/${taskId}`, {
    method: "PUT",
    auth: true,
    json: true,
    body: JSON.stringify({
      title: task.title,
      description: task.description,
      status: task.status,
      priority: task.priority,
      dueDate: task.dueDate,
    }),
  });
}

export function deleteTask(taskId: number): Promise<void> {
  return apiRequest<void>(`/api/tasks/${taskId}`, {
    method: "DELETE",
    auth: true,
  });
}

export function getTrialTasks(): Promise<Task[]> {
  return apiRequest<Task[]>("/api/trial/tasks");
}
