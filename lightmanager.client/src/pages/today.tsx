import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { QuickAdd } from "../components/tasks/quick-add";
import { TaskRow } from "../components/tasks/task-row";
import { usePersonalTasks } from "../hooks/usePersonalTasks";
import { formatLongDate, todayKey, toDateKey } from "../lib/date";
import { sortTasksByPriority } from "../lib/task";

export default function TodayPage() {
  const { tasks, loading, error, addTask, toggleTask, removeTask } = usePersonalTasks();
  const today = todayKey();
  const todayTasks = tasks.filter((task) => task.dueDate && toDateKey(task.dueDate) === today);
 
  const open = sortTasksByPriority(
    todayTasks.filter(
      (task) => task.status !== "Done",
    ),
  );

  const done = sortTasksByPriority(
    todayTasks.filter(
      (task) => task.status === "Done",
    ),
  );

  const unscheduledTasks = sortTasksByPriority(
    tasks.filter(
      (task) =>
        !task.dueDate &&
        task.status !== "Done",
    ),
  );

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-medium text-primary">Today</p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight">{formatLongDate(new Date())}</h1>
      </div>

      <QuickAdd onAdd={addTask} />

      {error && <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">{error}</div>}

      <Card>
        <CardHeader>
          <CardTitle>Today</CardTitle>
          <CardDescription>{open.length} open · {done.length} completed</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="py-8 text-center text-sm text-muted-foreground">Loading tasks…</p>
          ) : todayTasks.length === 0 ? (
            <div className="py-10 text-center">
              <p className="font-medium">Nothing planned for today.</p>
              <p className="mt-1 text-sm text-muted-foreground">Add one important thing above.</p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {[...open, ...done].map((task) => (
                <TaskRow key={task.id} task={task} onToggle={() => void toggleTask(task)} onDelete={() => void removeTask(task.id)} />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

       <Card>
        <CardHeader>
          <CardTitle>Unscheduled</CardTitle>
          <CardDescription>{unscheduledTasks.length} items waiting</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="py-8 text-center text-sm text-muted-foreground">Loading inbox…</p>
          ) : unscheduledTasks.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">Inbox zero.</p>
          ) : (
            <div className="divide-y divide-border">
              {unscheduledTasks.map((task) => (
                <TaskRow key={task.id} task={task} onToggle={() => void toggleTask(task)} onDelete={() => void removeTask(task.id)} />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
