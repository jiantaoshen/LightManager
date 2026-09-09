export type Status = "Todo" | "Done";
export type Priority = "Low" | "Medium" | "High";

export interface Task {
  id: number;
  title: string;
  description?: string;
  status: Status;
  priority: Priority;
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
}

export type PersonalTaskDraft = {
  title: string;
  description?: string;
  priority: Priority;
  dueDate?: string;
};
