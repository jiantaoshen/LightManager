/**
 * File: components/tasks/task-row.tsx
 * Purpose: Renders one task row with completion, priority, date, and delete controls.
 * Component: TaskRow.
 */

import type { Task } from "../../interfaces/ITask";
import { formatShortDate } from "../../lib/date";
import { getPriorityLabel } from "../../lib/priority";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";

type TaskRowProps = {
  task: Task;
  onToggle: () => void;
  onDelete: () => void;
};

export function TaskRow({ task, onToggle, onDelete }: TaskRowProps) {
  const isDone = task.status === "Done";

  return (
    <div className="group flex items-start gap-3 rounded-lg px-2 py-3 transition-colors hover:bg-muted/60">
      <button
        type="button"
        aria-label={isDone ? "Mark task as open" : "Complete task"}
        onClick={onToggle}
        className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-colors ${
          isDone
            ? "border-primary bg-primary text-primary-foreground"
            : "border-muted-foreground/40 bg-background"
        }`}
      >
        {isDone ? "✓" : ""}
      </button>

      <div className="min-w-0 flex-1 text-left">
        <div className="flex flex-wrap items-center gap-2">
          <p
            className={`text-sm font-medium text-foreground ${
              isDone ? "text-muted-foreground line-through" : ""
            }`}
          >
            {task.title}
          </p>

          <Badge className="priority-badge" data-priority={task.priority}>
            {getPriorityLabel(task.priority)}
          </Badge>
        </div>

        {(task.description || task.dueDate) && (
          <div className="mt-1 flex flex-wrap gap-2 text-xs text-muted-foreground">
            {task.description && <span className="truncate">{task.description}</span>}
            {task.dueDate && <span>• {formatShortDate(task.dueDate)}</span>}
          </div>
        )}
      </div>

      <Button
        variant="ghost"
        size="sm"
        aria-label={`Delete ${task.title}`}
        className="px-2 text-muted-foreground opacity-70 sm:opacity-0 sm:group-hover:opacity-100"
        onClick={onDelete}
      >
        ×
      </Button>
    </div>
  );
}
