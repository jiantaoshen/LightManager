/**
 * File: components/tasks/task-list-card.tsx
 * Purpose: Reuses the same task-list card layout across Today and Calendar views.
 * Component: TaskListCard.
 */

import type { ReactNode } from "react";
import type { Task } from "../../interfaces/ITask";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { TaskRow } from "./task-row";

type TaskListCardProps = {
  title: ReactNode;
  description?: ReactNode;
  tasks: Task[];
  loading: boolean;
  loadingText?: string;
  emptyTitle: string;
  emptyDescription?: string;
  onToggle: (task: Task) => void;
  onDelete: (taskId: number) => void;
};

export function TaskListCard({
  title,
  description,
  tasks,
  loading,
  loadingText = "Loading tasks…",
  emptyTitle,
  emptyDescription,
  onToggle,
  onDelete,
}: TaskListCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description ? <CardDescription>{description}</CardDescription> : null}
      </CardHeader>

      <CardContent>
        {loading ? (
          <p className="py-8 text-center text-sm text-muted-foreground">{loadingText}</p>
        ) : tasks.length === 0 ? (
          <div className="py-8 text-center">
            <p className="text-sm font-medium">{emptyTitle}</p>
            {emptyDescription ? (
              <p className="mt-1 text-sm text-muted-foreground">{emptyDescription}</p>
            ) : null}
          </div>
        ) : (
          <div className="divide-y divide-border">
            {tasks.map((task) => (
              <TaskRow
                key={task.id}
                task={task}
                onToggle={() => onToggle(task)}
                onDelete={() => onDelete(task.id)}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
