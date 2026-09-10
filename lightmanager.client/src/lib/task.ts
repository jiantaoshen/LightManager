import type {
  Priority,
  Task,
} from "../interfaces/ITask";

const priorityRank: Record<Priority, number> = {
  Low: 0,
  Medium: 1,
  High: 2,
};

export function compareTasksByPriority(
  a: Task,
  b: Task,
) {
  // Must > Priority > Non-priority
  const priorityDifference =
    priorityRank[b.priority] -
    priorityRank[a.priority];

  if (priorityDifference !== 0) {
    return priorityDifference;
  }

  // Same priority:
  // older tasks first
  const createdDifference =
    new Date(a.createdAt).getTime() -
    new Date(b.createdAt).getTime();

  if (createdDifference !== 0) {
    return createdDifference;
  }

  // Stable final fallback
  return a.id - b.id;
}

export function sortTasksByPriority(
  tasks: Task[],
) {
  return [...tasks].sort(compareTasksByPriority);
}

export { priorityRank };