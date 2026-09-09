import { QuickAdd } from "../components/tasks/quick-add";
import { TaskRow } from "../components/tasks/task-row";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { usePersonalTasks } from "../hooks/usePersonalTasks";

export default function InboxPage() {
  const { tasks, loading, error, addTask, toggleTask, removeTask } = usePersonalTasks();
  const inbox = tasks.filter((task) => !task.dueDate && task.status !== "Done");

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-medium text-primary">Inbox</p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight">Capture first, organize later.</h1>
        <p className="mt-2 text-sm text-muted-foreground">Fast notes and tasks that do not need a date yet.</p>
      </div>

      <QuickAdd onAdd={addTask} />
      {error && <p className="text-sm text-destructive">{error}</p>}

      <Card>
        <CardHeader>
          <CardTitle>Unscheduled</CardTitle>
          <CardDescription>{inbox.length} items waiting</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="py-8 text-center text-sm text-muted-foreground">Loading inbox…</p>
          ) : inbox.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">Inbox zero.</p>
          ) : (
            <div className="divide-y divide-border">
              {inbox.map((task) => (
                <TaskRow key={task.id} task={task} onToggle={() => void toggleTask(task)} onDelete={() => void removeTask(task.id)} />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
