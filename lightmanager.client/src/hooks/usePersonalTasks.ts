import { useCallback, useEffect, useState } from "react";
import type { PersonalTaskDraft, Task } from "../interfaces/ITask";
import { createTask, deleteTask, getTasks, updateTask } from "../services/taskService";

export function usePersonalTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setTasks(await getTasks());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load tasks");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const addTask = async (draft: PersonalTaskDraft) => {
    const created = await createTask({
      ...draft,
      title: draft.title.trim(),
      description: draft.description?.trim() || undefined,
    });

    setTasks((current) => [...current, created]);
    return created;
  };

  const toggleTask = async (task: Task) => {
    const optimistic: Task = {
      ...task,
      status: task.status === "Done" ? "Todo" : "Done",
    };

    setTasks((current) =>
      current.map((item) => (item.id === task.id ? optimistic : item)),
    );

    try {
      const saved = await updateTask(task.id, optimistic);
      setTasks((current) =>
        current.map((item) => (item.id === task.id ? saved : item)),
      );
      return saved;
    } catch (err) {
      setTasks((current) =>
        current.map((item) => (item.id === task.id ? task : item)),
      );
      throw err;
    }
  };

  const removeTask = async (taskId: number) => {
    const previous = tasks;
    setTasks((current) => current.filter((task) => task.id !== taskId));

    try {
      await deleteTask(taskId);
    } catch (err) {
      setTasks(previous);
      throw err;
    }
  };

  const editTask = async (task: Task) => {
    const saved = await updateTask(task.id, task);
    setTasks((current) =>
      current.map((item) => (item.id === task.id ? saved : item)),
    );
    return saved;
  };

  return {
    tasks,
    loading,
    error,
    addTask,
    toggleTask,
    removeTask,
    editTask,
    reload: load,
  };
}
