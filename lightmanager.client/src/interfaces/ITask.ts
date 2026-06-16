export type Status = "Todo" | "In Progress" | "Review" | "Done";

export interface Task {
    id: number;
    title: string;
    description?: string;
    status: Status;
    priority: "Low" | "Medium" | "High";
    assignedUsers: TaskAssignee[];
    dueDate?: Date;
}

export interface TaskAssignee {
    userId: string;
    userName: string;
}
