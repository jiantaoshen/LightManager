/**
 * File: lib/priority.ts
 * Purpose: Centralizes priority labels, ordering, options, and comparison logic.
 * Functions: getPriorityLabel, getHighestPriority.
 * Exports: PRIORITY_OPTIONS, PRIORITY_RANK.
 */

import type { Priority } from "../interfaces/ITask";

export const PRIORITY_OPTIONS: ReadonlyArray<{
  value: Priority;
  label: string;
}> = [
  { value: "Low", label: "Non-priority" },
  { value: "Medium", label: "Priority" },
  { value: "High", label: "Must" },
];

export const PRIORITY_RANK: Record<Priority, number> = {
  Low: 0,
  Medium: 1,
  High: 2,
};

export function getPriorityLabel(priority: Priority): string {
  return PRIORITY_OPTIONS.find((option) => option.value === priority)?.label ?? priority;
}

export function getHighestPriority(a: Priority, b: Priority): Priority {
  return PRIORITY_RANK[a] >= PRIORITY_RANK[b] ? a : b;
}
