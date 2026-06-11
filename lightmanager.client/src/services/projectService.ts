/*
    This file contains all the functions related to project management, 
    such as creating, updating, deleting projects, and managing project members.
*/

const API_URL = "/api/projects";

export interface CreateProjectDTO {
    name: string;
    description?: string;
}

export interface UpdateProjectDTO {
    name: string;
    description?: string;
}

export async function getProjects() {
    const response = await fetch(API_URL);

    if (!response.ok) {
        throw new Error(
            "Failed to load projects"
        );
    }

    return await response.json();
}


export async function getProject(projectId: number) {
    const token = localStorage.getItem("token");

    const response = await fetch(`${API_URL}/${projectId}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    if (!response.ok) {
        throw new Error("Failed to load project");
    }

    return await response.json();
}

export async function createProject(project: CreateProjectDTO) {
    const token = localStorage.getItem("token");

    const response = await fetch(API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(project),
    });

    if (!response.ok) {
        throw new Error("Failed to create project");
    }

    return await response.json();
}

export async function updateProject(projectId: number, data: {
    name: string;
    description: string;
}) {
    const token = localStorage.getItem("token");

    const response = await fetch(`${API_URL}/${projectId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(data)
    });

    if (!response.ok) {
        const text = await response.text();
        throw new Error(text || "Failed to update project");
    }

    return await response.json();
}

export async function deleteProject(projectId: number) {
    const token = localStorage.getItem("token");

    const response = await fetch(`${API_URL}/${projectId}`, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    if (!response.ok) {
        const text = await response.text();
        throw new Error(text || "Failed to delete project");
    }

    return await response.json();
}

export async function addMember(projectId: number, email: string) {
    const token = localStorage.getItem("token");

    const res = await fetch(`${API_URL}/${projectId}/members`,{
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ email })
        }
    );

    if (!res.ok) {
        throw new Error(await res.text());
    }

    return await res.json();
}

export async function removeMember(projectId: number, userId: string) {
    const token = localStorage.getItem("token");

    const res = await fetch(`${API_URL}/${projectId}/members/${userId}`,{
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );

    if (!res.ok) {
        throw new Error(await res.text());
    }

    return true;
}