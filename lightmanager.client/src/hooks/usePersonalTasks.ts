import {
  useCallback,
  useEffect,
  useState,
} from "react";

import { useAuth } from "../context/useAuth";

import type {
  PersonalTaskDraft,
  Task,
} from "../interfaces/ITask";

import {
  createTask,
  deleteTask,
  getTasks,
  getTrialTasks,
  updateTask,
} from "../services/taskService";

import {
  getLocalTrialTasks,
  saveLocalTrialTasks,
} from "../lib/trial";

function getNextTrialTaskId(
  tasks: Task[],
) {
  const smallestId = tasks.reduce(
    (smallest, task) =>
      Math.min(smallest, task.id),
    0,
  );

  return smallestId <= 0
    ? smallestId - 1
    : -1;
}

export function usePersonalTasks() {
  const { isTrial } = useAuth();

  const [tasks, setTasks] =
    useState<Task[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      if (isTrial) {
        /*
          First check whether this browser
          already has modified trial data.
        */
        const localTasks =
          getLocalTrialTasks();

        if (localTasks) {
          setTasks(localTasks);
          return;
        }

        /*
          No local copy yet:
          download the read-only template
          from 1@test.se.
        */
        const trialTasks =
          await getTrialTasks();

        setTasks(trialTasks);
        saveLocalTrialTasks(trialTasks);

        return;
      }

      setTasks(await getTasks());
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load tasks",
      );
    } finally {
      setLoading(false);
    }
  }, [isTrial]);

  useEffect(() => {
    void load();
  }, [load]);

  const addTask = async (
    draft: PersonalTaskDraft,
  ) => {
    /*
      TRIAL:
      Create a completely local Task.
    */
    if (isTrial) {
      const now =
        new Date().toISOString();

      const created: Task = {
        id: getNextTrialTaskId(tasks),

        title: draft.title.trim(),

        description:
          draft.description?.trim() ||
          undefined,

        status: "Todo",

        priority: draft.priority,

        dueDate:
          draft.dueDate ?? null,

        createdAt: now,
        updatedAt: now,
      };

      setTasks((current) => {
        const next = [
          ...current,
          created,
        ];

        saveLocalTrialTasks(next);

        return next;
      });

      return created;
    }

    /*
      AUTHENTICATED:
      Normal database create.
    */
    const created = await createTask({
      ...draft,

      title:
        draft.title.trim(),

      description:
        draft.description?.trim() ||
        undefined,
    });

    setTasks((current) => [
      ...current,
      created,
    ]);

    return created;
  };

  const toggleTask = async (
    task: Task,
  ) => {
    const now =
      new Date().toISOString();

    const nextStatus =
      task.status === "Done"
        ? "Todo"
        : "Done";

    const optimistic: Task = {
      ...task,

      status: nextStatus,

      updatedAt: now,

      completedAt:
        nextStatus === "Done"
          ? now
          : undefined,
    };

    /*
      TRIAL:
      local only.
    */
    if (isTrial) {
      setTasks((current) => {
        const next = current.map(
          (item) =>
            item.id === task.id
              ? optimistic
              : item,
        );

        saveLocalTrialTasks(next);

        return next;
      });

      return optimistic;
    }

    /*
      AUTHENTICATED:
      normal optimistic database update.
    */
    setTasks((current) =>
      current.map((item) =>
        item.id === task.id
          ? optimistic
          : item,
      ),
    );

    try {
      const saved =
        await updateTask(
          task.id,
          optimistic,
        );

      setTasks((current) =>
        current.map((item) =>
          item.id === task.id
            ? saved
            : item,
        ),
      );

      return saved;
    } catch (err) {
      setTasks((current) =>
        current.map((item) =>
          item.id === task.id
            ? task
            : item,
        ),
      );

      throw err;
    }
  };

  const removeTask = async (
    taskId: number,
  ) => {
    /*
      TRIAL:
      Delete only local copy.
    */
    if (isTrial) {
      setTasks((current) => {
        const next =
          current.filter(
            (task) =>
              task.id !== taskId,
          );

        saveLocalTrialTasks(next);

        return next;
      });

      return;
    }

    /*
      AUTHENTICATED:
      database delete.
    */
    const previous = tasks;

    setTasks((current) =>
      current.filter(
        (task) =>
          task.id !== taskId,
      ),
    );

    try {
      await deleteTask(taskId);
    } catch (err) {
      setTasks(previous);
      throw err;
    }
  };

  const editTask = async (
    task: Task,
  ) => {
    /*
      TRIAL:
      edit local only.
    */
    if (isTrial) {
      const edited: Task = {
        ...task,
        updatedAt:
          new Date().toISOString(),
      };

      setTasks((current) => {
        const next =
          current.map((item) =>
            item.id === task.id
              ? edited
              : item,
          );

        saveLocalTrialTasks(next);

        return next;
      });

      return edited;
    }

    /*
      AUTHENTICATED:
      database update.
    */
    const saved =
      await updateTask(
        task.id,
        task,
      );

    setTasks((current) =>
      current.map((item) =>
        item.id === task.id
          ? saved
          : item,
      ),
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