import { useMemo, useState } from "react";
import { QuickAdd } from "../components/tasks/quick-add";
import { TaskRow } from "../components/tasks/task-row";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { usePersonalTasks } from "../hooks/usePersonalTasks";
import { toDateKey, todayKey } from "../lib/date";

function buildMonth(cursor: Date) {
  const year = cursor.getFullYear();
  const month = cursor.getMonth();
  const first = new Date(year, month, 1);
  const mondayOffset = (first.getDay() + 6) % 7;
  const start = new Date(year, month, 1 - mondayOffset);
  return Array.from({ length: 42 }, (_, index) => new Date(start.getFullYear(), start.getMonth(), start.getDate() + index));
}

export default function CalendarPage() {
  const { tasks, loading, addTask, toggleTask, removeTask } = usePersonalTasks();
  const [cursor, setCursor] = useState(() => new Date());
  const [selected, setSelected] = useState(todayKey());
  const days = useMemo(() => buildMonth(cursor), [cursor]);
  const selectedTasks = tasks.filter((task) => task.dueDate && toDateKey(task.dueDate) === selected);
  const counts = useMemo(() => {
    const map = new Map<string, number>();
    tasks.forEach((task) => {
      if (!task.dueDate || task.status === "Done") return;
      const key = toDateKey(task.dueDate);
      map.set(key, (map.get(key) ?? 0) + 1);
    });
    return map;
  }, [tasks]);

  const monthLabel = new Intl.DateTimeFormat(undefined, { month: "long", year: "numeric" }).format(cursor);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-medium text-primary">Calendar</p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight">Plan without overplanning.</h1>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <Card>
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle>{monthLabel}</CardTitle>
              <CardDescription>Select a day to view its tasks.</CardDescription>
            </div>
            <div className="flex gap-1">
              <Button variant="outline" size="sm" onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1))}>←</Button>
              <Button variant="outline" size="sm" onClick={() => setCursor(new Date())}>Today</Button>
              <Button variant="outline" size="sm" onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1))}>→</Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 text-center text-xs font-medium text-muted-foreground">
              {['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map((day) => <div key={day} className="py-2">{day}</div>)}
            </div>
            <div className="grid grid-cols-7 overflow-hidden rounded-lg border border-border">
              {days.map((date) => {
                const key = toDateKey(date);
                const inMonth = date.getMonth() === cursor.getMonth();
                const isSelected = key === selected;
                const isToday = key === todayKey();
                const count = counts.get(key) ?? 0;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setSelected(key)}
                    className={`relative aspect-square border-b border-r border-border p-1 text-sm transition-colors hover:bg-accent ${
                      isSelected ? "bg-accent text-accent-foreground" : ""
                    } ${!inMonth ? "text-muted-foreground/40" : ""}`}
                  >
                    <span className={isToday ? "font-bold text-primary" : ""}>{date.getDate()}</span>
                    {count > 0 && <span className="absolute bottom-1 left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-primary" />}
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <QuickAdd defaultDate={selected} onAdd={addTask} />
          <Card>
            <CardHeader>
              <CardTitle>{selected}</CardTitle>
              <CardDescription>{selectedTasks.length} tasks</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <p className="py-6 text-center text-sm text-muted-foreground">Loading…</p>
              ) : selectedTasks.length === 0 ? (
                <p className="py-6 text-center text-sm text-muted-foreground">No tasks for this day.</p>
              ) : (
                <div className="divide-y divide-border">
                  {selectedTasks.map((task) => <TaskRow key={task.id} task={task} onToggle={() => void toggleTask(task)} onDelete={() => void removeTask(task.id)} />)}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
