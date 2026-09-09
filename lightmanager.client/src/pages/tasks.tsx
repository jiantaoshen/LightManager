import { useMemo, useState } from "react";
import { TaskRow } from "../components/tasks/task-row";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { usePersonalTasks } from "../hooks/usePersonalTasks";

export default function TasksPage() {
  const { tasks, loading, toggleTask, removeTask } = usePersonalTasks();
  const [query, setQuery] = useState("");
  const [showCompleted, setShowCompleted] = useState(false);

  const visible = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return tasks
      .filter((task) => showCompleted || task.status !== "Done")
      .filter((task) => !normalized || `${task.title} ${task.description ?? ""}`.toLowerCase().includes(normalized));
  }, [tasks, query, showCompleted]);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-medium text-primary">All tasks</p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight">Everything in one place.</h1>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Input placeholder="Search tasks…" value={query} onChange={(event) => setQuery(event.target.value)} />
        <label className="flex h-10 shrink-0 items-center gap-2 rounded-md border border-border px-3 text-sm">
          <input type="checkbox" checked={showCompleted} onChange={(event) => setShowCompleted(event.target.checked)} />
          Show completed
        </label>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tasks</CardTitle>
          <CardDescription>{visible.length} shown</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="py-8 text-center text-sm text-muted-foreground">Loading tasks…</p>
          ) : visible.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">No matching tasks.</p>
          ) : (
            <div className="divide-y divide-border">
              {visible.map((task) => (
                <TaskRow key={task.id} task={task} onToggle={() => void toggleTask(task)} onDelete={() => void removeTask(task.id)} />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
