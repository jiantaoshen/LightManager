import type { Task } from "../interfaces/ITask";

export const TRIAL_TASKS_STORAGE_KEY =
  "lightmanager.trial.tasks.v1";

export function getLocalTrialTasks(): Task[] | null {
  const saved = localStorage.getItem(
    TRIAL_TASKS_STORAGE_KEY,
  );

  if (!saved) {
    return null;
  }

  try {
    return JSON.parse(saved) as Task[];
  } catch {
    localStorage.removeItem(
      TRIAL_TASKS_STORAGE_KEY,
    );

    return null;
  }
}

export function saveLocalTrialTasks(
  tasks: Task[],
) {
  localStorage.setItem(
    TRIAL_TASKS_STORAGE_KEY,
    JSON.stringify(tasks),
  );
}

export function clearLocalTrialTasks() {
  localStorage.removeItem(
    TRIAL_TASKS_STORAGE_KEY,
  );
}