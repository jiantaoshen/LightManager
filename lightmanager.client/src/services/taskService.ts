const API_URL = "/api/projects";

export async function getTasks(projectId: number) {
    const res = await fetch(`${API_URL}/${projectId}/tasks`);
    return res.json();
}

export async function createTask(projectId: number, task: any) {
    const token = localStorage.getItem("token");

    const res = await fetch(`${API_URL}/${projectId}/tasks`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(task),
    });

    if (!res.ok) {
        const error = await res.json().catch(() => null);

        console.error("Status:", res.status);
        console.error("Error:", error);

        throw new Error(JSON.stringify(error));
    }

    return res.json();
}

export async function updateTask(projectId: number, taskId: number, task: any) {
    const token = localStorage.getItem("token");

    const res = await fetch(
        `${API_URL}/${projectId}/tasks/${taskId}`,
        {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(task),
        }
    );

    if (!res.ok) throw new Error("Update task failed");
    return res.json();
}

export async function deleteTask(projectId: number, taskId: number) {
    const token = localStorage.getItem("token");

    const res = await fetch(
        `${API_URL}/${projectId}/tasks/${taskId}`,
        {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    if (!res.ok) throw new Error("Delete task failed");
}