export interface Project {
    id: number;
    name: string;
    description: string | null;
    owner: string;
    status: "Active" | "Completed" | "Archived";
    totalMembers?: number;
    members?: Member[];
    createdAt?: Date;
}

export interface Member {
    userId: string;
    userName: string;
    email: string;
    role: string;
};