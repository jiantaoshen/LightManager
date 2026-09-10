/**
 * File: hooks/usePersonalTasks.ts
 * Purpose: Provides one task state API for authenticated database-backed users and local-only Trial users.
 * Hook: usePersonalTasks.
 * Functions: getNextTrialTaskId, load, addTask, toggleTask, removeTask, editTask.
 */

import { useCallback, useEffect, useState } from "react";
import { useAuth } from "../context/useAuth";
import type { PersonalTaskDraft, Task } from "../interfaces/ITask";
import { getLocalTrialTasks, saveLocalTrialTasks } from "../lib/trial";
import {
  createTask,
  deleteTask,
  getTasks,
  getTrialTasks,
  updateTask,
} from "../services/taskService";

function getNextTrialTaskId(tasks: Task[]): number {
  const smallestId = tasks.reduce(
    (smallest, task) => Math.min(smallest, task.id),
    0,
  );

  return smallestId <= 0 ? smallestId - 1 : -1;
}

export function usePersonalTasks() {
  const { isTrial } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const updateTrialTasks = (updater: (current: Task[]) => Task[]) => {
    setTasks((current) => {
      const next = updater(current);
      saveLocalTrialTasks(next);
      return next;
    });
  };

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      if (isTrial) {
        const localTasks = getLocalTrialTasks();

        if (localTasks) {
          setTasks(localTasks);
          return;
        }

        const trialTasks = await getTrialTasks();
        setTasks(trialTasks);
        saveLocalTrialTasks(trialTasks);
        return;
      }

      setTasks(await getTasks());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load tasks");
    } finally {
      setLoading(false);
    }
  }, [isTrial]);

  useEffect(() => {
    void load();
  }, [load]);

  const addTask = async (draft: PersonalTaskDraft) => {
    if (isTrial) {
      const now = new Date().toISOString();
      const created: Task = {
        id: getNextTrialTaskId(tasks),
        title: draft.title.trim(),
        description: draft.description?.trim() || undefined,
        status: "Todo",
        priority: draft.priority,
        dueDate: draft.dueDate ?? null,
        createdAt: now,
        updatedAt: now,
      };

      updateTrialTasks((current) => [...current, created]);
      return created;
    }

    const created = await createTask({
      ...draft,
      title: draft.title.trim(),
      description: draft.description?.trim() || undefined,
    });

    setTasks((current) => [...current, created]);
    return created;
  };

  const toggleTask = async (task: Task) => {
    const now = new Date().toISOString();
    const nextStatus = task.status === "Done" ? "Todo" : "Done";
    const optimistic: Task = {
      ...task,
      status: nextStatus,
      updatedAt: now,
      completedAt: nextStatus === "Done" ? now : undefined,
    };

    if (isTrial) {
      updateTrialTasks((current) =>
        current.map((item) => (item.id === task.id ? optimistic : item)),
      );
      return optimistic;
    }

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
    if (isTrial) {
      updateTrialTasks((current) => current.filter((task) => task.id !== taskId));
      return;
    }

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
    if (isTrial) {
      const edited: Task = {
        ...task,
        updatedAt: new Date().toISOString(),
      };

      updateTrialTasks((current) =>
        current.map((item) => (item.id === task.id ? edited : item)),
      );
      return edited;
    }

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
