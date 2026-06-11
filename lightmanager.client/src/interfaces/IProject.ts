export interface Project {
    id: number;
    name: string;
    description: string | null;
    owner: string;
    status: "Active" | "Completed" | "Archived";
    members: number[];
    dueDate: string;
}

export interface Member {
    userId: string;
    userName: string;
    email: string;
    role: string;
};