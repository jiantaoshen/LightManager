/**
 * File: pages/tasks.tsx
 * Purpose: Provides searchable access to all tasks, with optional completed-task visibility.
 * Component: TasksPage.
 */

import { useMemo, useState } from "react";
import { TaskListCard } from "../components/tasks/task-list-card";
import { Input } from "../components/ui/input";
import { usePersonalTasks } from "../hooks/usePersonalTasks";
import { sortTasksByPriority } from "../lib/task";

export default function TasksPage() {
  const { tasks, loading, toggleTask, removeTask } = usePersonalTasks();
  const [query, setQuery] = useState("");
  const [showCompleted, setShowCompleted] = useState(false);

  const visibleTasks = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    const filtered = tasks
      .filter((task) => showCompleted || task.status !== "Done")
      .filter(
        (task) =>
          !normalized ||
          `${task.title} ${task.description ?? ""}`.toLowerCase().includes(normalized),
      );

    return sortTasksByPriority(filtered);
  }, [tasks, query, showCompleted]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row">
        <Input
          placeholder="Search tasks…"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
        <label className="flex h-10 shrink-0 items-center gap-2 rounded-md border border-border px-3 text-sm">
          <input
            type="checkbox"
            checked={showCompleted}
            onChange={(event) => setShowCompleted(event.target.checked)}
          />
          Show completed
        </label>
      </div>

      <TaskListCard
        title="Tasks"
        description={`${visibleTasks.length} shown`}
        tasks={visibleTasks}
        loading={loading}
        emptyTitle="No matching tasks."
        onToggle={(task) => void toggleTask(task)}
        onDelete={(taskId) => void removeTask(taskId)}
      />
    </div>
  );
}
