/**
 * File: lib/calendar.ts
 * Purpose: Contains calendar-specific date-grid and task-summary helpers used by CalendarPage.
 * Functions: buildMonthGrid, buildTaskDaySummaries, formatMonthLabel.
 */

import type { Priority, Task } from "../interfaces/ITask";
import { toDateKey } from "./date";
import { getHighestPriority } from "./priority";

export type TaskDaySummary = {
  count: number;
  highestPriority: Priority;
};

export function buildMonthGrid(cursor: Date): Date[] {
  const year = cursor.getFullYear();
  const month = cursor.getMonth();
  const first = new Date(year, month, 1);
  const mondayOffset = (first.getDay() + 6) % 7;
  const start = new Date(year, month, 1 - mondayOffset);

  return Array.from(
    { length: 42 },
    (_, index) =>
      new Date(start.getFullYear(), start.getMonth(), start.getDate() + index),
  );
}

export function buildTaskDaySummaries(tasks: Task[]): Map<string, TaskDaySummary> {
  const summaries = new Map<string, TaskDaySummary>();

  tasks.forEach((task) => {
    if (!task.dueDate || task.status === "Done") {
      return;
    }

    const key = toDateKey(task.dueDate);
    const current = summaries.get(key);

    if (!current) {
      summaries.set(key, {
        count: 1,
        highestPriority: task.priority,
      });
      return;
    }

    summaries.set(key, {
      count: current.count + 1,
      highestPriority: getHighestPriority(current.highestPriority, task.priority),
    });
  });

  return summaries;
}

export function formatMonthLabel(cursor: Date): string {
  return new Intl.DateTimeFormat(undefined, {
    month: "long",
    year: "numeric",
  }).format(cursor);
}
