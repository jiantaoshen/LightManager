/**
 * File: lib/storage.ts
 * Purpose: Centralizes browser storage keys so authentication and trial storage use one source of truth.
 * Exports: STORAGE_KEYS.
 */

export const STORAGE_KEYS = {
  authUser: "user",
  authToken: "token",
  trialTasks: "lightmanager.trial.tasks.v1",
} as const;
