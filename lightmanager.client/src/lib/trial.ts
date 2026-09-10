/**
 * File: lib/trial.ts
 * Purpose: Reads, writes, and clears the browser-only task copy used by Trial mode.
 * Functions: getLocalTrialTasks, saveLocalTrialTasks, clearLocalTrialTasks.
 */

import type { Task } from "../interfaces/ITask";
import { STORAGE_KEYS } from "./storage";

export function getLocalTrialTasks(): Task[] | null {
  const saved = localStorage.getItem(STORAGE_KEYS.trialTasks);

  if (!saved) return null;

  try {
    return JSON.parse(saved) as Task[];
  } catch {
    localStorage.removeItem(STORAGE_KEYS.trialTasks);
    return null;
  }
}

export function saveLocalTrialTasks(tasks: Task[]): void {
  localStorage.setItem(STORAGE_KEYS.trialTasks, JSON.stringify(tasks));
}

export function clearLocalTrialTasks(): void {
  localStorage.removeItem(STORAGE_KEYS.trialTasks);
}
