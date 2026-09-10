/**
 * File: pages/calendar.tsx
 * Purpose: Shows monthly task planning, priority-based day indicators, selected-date tasks, and unscheduled tasks.
 * Component: CalendarPage.
 * Functions: goToPreviousMonth, goToNextMonth, goToToday.
 */

import { useMemo, useState } from "react";
import { TaskListCard } from "../components/tasks/task-list-card";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { usePersonalTasks } from "../hooks/usePersonalTasks";
import { buildMonthGrid, buildTaskDaySummaries, formatMonthLabel } from "../lib/calendar";
import { PRIORITY_OPTIONS } from "../lib/priority";
import { getTasksForDate, getUnscheduledTasks } from "../lib/task";
import { todayKey, toDateKey } from "../lib/date";

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;

export default function CalendarPage() {
  const { tasks, loading, toggleTask, removeTask } = usePersonalTasks();
  const [cursor, setCursor] = useState(() => new Date());
  const [selected, setSelected] = useState(todayKey());

  const days = useMemo(() => buildMonthGrid(cursor), [cursor]);
  const daySummaries = useMemo(() => buildTaskDaySummaries(tasks), [tasks]);
  const selectedTasks = getTasksForDate(tasks, selected);
  const unscheduledTasks = getUnscheduledTasks(tasks);

  const goToPreviousMonth = () => {
    setCursor(new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1));
  };

  const goToToday = () => {
    const today = new Date();
    setCursor(today);
    setSelected(todayKey());
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <Card>
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle>{formatMonthLabel(cursor)}</CardTitle>
              <CardDescription>Select a day to view its tasks.</CardDescription>
            </div>

            <div className="flex gap-1">
              <Button variant="outline" size="sm" onClick={goToPreviousMonth} aria-label="Previous month">
                ←
              </Button>
              <Button variant="outline" size="sm" onClick={goToToday}>
                Today
              </Button>
              <Button variant="outline" size="sm" onClick={goToNextMonth} aria-label="Next month">
                →
              </Button>
            </div>
          </CardHeader>

          <CardContent>
            <div className="grid grid-cols-7 text-center text-xs font-medium text-muted-foreground">
              {WEEKDAYS.map((day) => (
                <div key={day} className="py-2">
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 overflow-hidden rounded-lg border border-border">
              {days.map((date) => {
                const key = toDateKey(date);
                const inMonth = date.getMonth() === cursor.getMonth();
                const isSelected = key === selected;
                const isToday = key === todayKey();
                const summary = daySummaries.get(key);

                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setSelected(key)}
                    className={`relative aspect-square border-b border-r border-border p-1 text-sm transition-colors hover:bg-accent ${
                      isSelected ? "bg-accent text-accent-foreground" : ""
                    } ${!inMonth ? "text-muted-foreground/40" : ""}`}
                  >
                    <span className={isToday ? "font-bold text-primary" : ""}>
                      {date.getDate()}
                    </span>

                    {summary && (
                      <span
                        className="priority-dot absolute bottom-1 left-1/2 h-1.5 w-1.5 -translate-x-1/2"
                        data-priority={summary.highestPriority}
                        aria-label={`${summary.count} unfinished ${summary.count === 1 ? "task" : "tasks"}`}
                      />
                    )}
                  </button>
                );
              })}
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground">
              {PRIORITY_OPTIONS.map((option) => (
                <div key={option.value} className="flex items-center gap-1.5">
                  <span className="priority-dot h-2 w-2" data-priority={option.value} />
                  <span>{option.label}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <TaskListCard
            title={selected}
            description={`${selectedTasks.length} ${selectedTasks.length === 1 ? "task" : "tasks"}`}
            tasks={selectedTasks}
            loading={loading}
            emptyTitle="No tasks for this day."
            onToggle={(task) => void toggleTask(task)}
            onDelete={(taskId) => void removeTask(taskId)}
          />

          <TaskListCard
            title="Unscheduled"
            description={`${unscheduledTasks.length} ${unscheduledTasks.length === 1 ? "task" : "tasks"}`}
            tasks={unscheduledTasks}
            loading={loading}
            emptyTitle="No unscheduled tasks."
            emptyDescription="Tasks without a due date remain available while you plan."
            onToggle={(task) => void toggleTask(task)}
            onDelete={(taskId) => void removeTask(taskId)}
          />
        </div>
      </div>
    </div>
  );
}
