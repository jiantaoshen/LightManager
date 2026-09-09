import type { PersonalTaskDraft, Task } from "../interfaces/ITask";

const API_URL = `${import.meta.env.VITE_API_URL}/api/tasks`;

function authHeaders(json = false): HeadersInit {
  const token = localStorage.getItem("token");
  return {
    ...(json ? { "Content-Type": "application/json" } : {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function readResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const error = await res.text();
    throw new Error(error || `Request failed (${res.status})`);
  }

  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

export async function getTasks(): Promise<Task[]> {
  const res = await fetch(API_URL, { headers: authHeaders() });
  return readResponse<Task[]>(res);
}

export async function createTask(draft: PersonalTaskDraft): Promise<Task> {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: authHeaders(true),
    body: JSON.stringify(draft),
  });
  return readResponse<Task>(res);
}

export async function updateTask(taskId: number, task: Task): Promise<Task> {
  const res = await fetch(`${API_URL}/${taskId}`, {
    method: "PUT",
    headers: authHeaders(true),
    body: JSON.stringify({
      title: task.title,
      description: task.description,
      status: task.status,
      priority: task.priority,
      dueDate: task.dueDate,
    }),
  });
  return readResponse<Task>(res);
}

export async function deleteTask(taskId: number): Promise<void> {
  const res = await fetch(`${API_URL}/${taskId}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  return readResponse<void>(res);
}
