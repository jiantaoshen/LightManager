/**
 * File: lib/task.ts
 * Purpose: Provides reusable task filtering and sorting helpers for Today, Calendar, and task lists.
 * Functions: compareTasksByPriority, sortTasksByPriority, getTasksForDate,
 * getUnscheduledTasks, getOpenTasks, getCompletedTasks.
 */

import type { Task } from "../interfaces/ITask";
import { PRIORITY_RANK } from "./priority";
import { toDateKey } from "./date";

export function compareTasksByPriority(a: Task, b: Task): number {
  const priorityDifference = PRIORITY_RANK[b.priority] - PRIORITY_RANK[a.priority];

  if (priorityDifference !== 0) {
    return priorityDifference;
  }

  const createdDifference = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();

  if (createdDifference !== 0) {
    return createdDifference;
  }

  return a.id - b.id;
}

export function sortTasksByPriority(tasks: Task[]): Task[] {
  return [...tasks].sort(compareTasksByPriority);
}

export function getTasksForDate(tasks: Task[], dateKey: string): Task[] {
  return sortTasksByPriority(
    tasks.filter((task) => task.dueDate && toDateKey(task.dueDate) === dateKey),
  );
}

export function getUnscheduledTasks(tasks: Task[]): Task[] {
  return sortTasksByPriority(
    tasks.filter((task) => !task.dueDate && task.status !== "Done"),
  );
}

export function getOpenTasks(tasks: Task[]): Task[] {
  return sortTasksByPriority(tasks.filter((task) => task.status !== "Done"));
}

export function getCompletedTasks(tasks: Task[]): Task[] {
  return sortTasksByPriority(tasks.filter((task) => task.status === "Done"));
}
