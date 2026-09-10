/**
 * File: interfaces/ITask.ts
 * Purpose: Defines the frontend task status, priority, API task shape, and task creation draft.
 * Types: Status, Priority, Task, PersonalTaskDraft.
 */

export type Status = "Todo" | "Done";
export type Priority = "Low" | "Medium" | "High";

export interface Task {
  id: number;
  title: string;
  description?: string;
  status: Status;
  priority: Priority;
  dueDate: string | null;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
}

export type PersonalTaskDraft = {
  title: string;
  description?: string;
  priority: Priority;
  dueDate?: string | null;
};
