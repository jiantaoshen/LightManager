import { useMemo, useState } from "react";
import { TaskRow } from "../components/tasks/task-row";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { usePersonalTasks } from "../hooks/usePersonalTasks";
import { toDateKey, todayKey } from "../lib/date";
import type { Priority } from "../interfaces/ITask";
import {
  priorityRank,
  sortTasksByPriority,
} from "../lib/task";

function buildMonth(cursor: Date) {
  const year = cursor.getFullYear();
  const month = cursor.getMonth();

  const first = new Date(year, month, 1);

  // Convert Sunday-based getDay() into Monday-based offset.
  const mondayOffset = (first.getDay() + 6) % 7;

  const start = new Date(
    year,
    month,
    1 - mondayOffset,
  );

  return Array.from(
    { length: 42 },
    (_, index) =>
      new Date(
        start.getFullYear(),
        start.getMonth(),
        start.getDate() + index,
      ),
  );
}

/*
  Backend/API values remain:
  Low    = Non-priority
  Medium = Priority
  High   = Must
*/
function getPriorityDotClass(priority: Priority) {
  switch (priority) {
    case "High":
      // Must
      return "bg-red-500";

    case "Medium":
      // Priority
      return "bg-yellow-400";

    case "Low":
    default:
      // Non-priority
      return "bg-blue-500";
  }
}

export default function CalendarPage() {
  const {
    tasks,
    loading,
    addTask,
    toggleTask,
    removeTask,
  } = usePersonalTasks();

  const [cursor, setCursor] = useState(
    () => new Date(),
  );

  const [selected, setSelected] =
    useState(todayKey());

  const days = useMemo(
    () => buildMonth(cursor),
    [cursor],
  );

  /*
    Tasks shown in the right-side panel.

    Completed tasks are intentionally included here,
    matching the original Calendar behavior.
  */
  const selectedTasks = sortTasksByPriority(
    tasks.filter(
      (task) =>
        task.dueDate &&
        toDateKey(task.dueDate) === selected,
    ),
  );

  /*
    For every calendar date, determine:
    - how many unfinished tasks exist
    - the highest priority among them

    Priority order:
    Low < Medium < High

    Display meaning:
    Low    -> Non-priority -> Blue
    Medium -> Priority     -> Yellow
    High   -> Must         -> Red
  */
  const daySummaries = useMemo(() => {
    const map = new Map<
      string,
      {
        count: number;
        highestPriority: Priority;
      }
    >();

    tasks.forEach((task) => {
      // Unscheduled tasks do not belong on Calendar.
      if (!task.dueDate) {
        return;
      }

      // Completed tasks do not affect the calendar dot.
      if (task.status === "Done") {
        return;
      }

      const key = toDateKey(task.dueDate);
      const current = map.get(key);

      if (!current) {
        map.set(key, {
          count: 1,
          highestPriority: task.priority,
        });

        return;
      }

      const highestPriority =
        priorityRank[task.priority] >
        priorityRank[current.highestPriority]
          ? task.priority
          : current.highestPriority;

      map.set(key, {
        count: current.count + 1,
        highestPriority,
      });
    });

    return map;
  }, [tasks]);

  const monthLabel =
    new Intl.DateTimeFormat(undefined, {
      month: "long",
      year: "numeric",
    }).format(cursor);

  const goToPreviousMonth = () => {
    setCursor(
      new Date(
        cursor.getFullYear(),
        cursor.getMonth() - 1,
        1,
      ),
    );
  };

  const goToNextMonth = () => {
    setCursor(
      new Date(
        cursor.getFullYear(),
        cursor.getMonth() + 1,
        1,
      ),
    );
  };

  const goToToday = () => {
    const today = new Date();

    setCursor(today);
    setSelected(todayKey());
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-medium text-primary">
          Calendar
        </p>

        <h1 className="mt-1 text-3xl font-semibold tracking-tight">
          Plan without overplanning.
        </h1>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <Card>
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle>{monthLabel}</CardTitle>

              <CardDescription>
                Select a day to view its tasks.
              </CardDescription>
            </div>

            <div className="flex gap-1">
              <Button
                variant="outline"
                size="sm"
                onClick={goToPreviousMonth}
              >
                ←
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={goToToday}
              >
                Today
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={goToNextMonth}
              >
                →
              </Button>
            </div>
          </CardHeader>

          <CardContent>
            <div className="grid grid-cols-7 text-center text-xs font-medium text-muted-foreground">
              {[
                "Mon",
                "Tue",
                "Wed",
                "Thu",
                "Fri",
                "Sat",
                "Sun",
              ].map((day) => (
                <div
                  key={day}
                  className="py-2"
                >
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 overflow-hidden rounded-lg border border-border">
              {days.map((date) => {
                const key = toDateKey(date);

                const inMonth =
                  date.getMonth() ===
                  cursor.getMonth();

                const isSelected =
                  key === selected;

                const isToday =
                  key === todayKey();

                const summary =
                  daySummaries.get(key);

                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() =>
                      setSelected(key)
                    }
                    className={`relative aspect-square border-b border-r border-border p-1 text-sm transition-colors hover:bg-accent ${
                      isSelected
                        ? "bg-accent text-accent-foreground"
                        : ""
                    } ${
                      !inMonth
                        ? "text-muted-foreground/40"
                        : ""
                    }`}
                  >
                    <span
                      className={
                        isToday
                          ? "font-bold text-primary"
                          : ""
                      }
                    >
                      {date.getDate()}
                    </span>

                    {summary && (
                      <span
                        className={`absolute bottom-1 left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full ${getPriorityDotClass(
                          summary.highestPriority,
                        )}`}
                        aria-label={`${summary.count} unfinished task${
                          summary.count === 1
                            ? ""
                            : "s"
                        }`}
                      />
                    )}
                  </button>
                );
              })}
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-blue-500" />
                <span>Non-priority</span>
              </div>

              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-yellow-400" />
                <span>Priority</span>
              </div>

              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-red-500" />
                <span>Must</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{selected}</CardTitle>

              <CardDescription>
                {selectedTasks.length}{" "}
                {selectedTasks.length === 1
                  ? "task"
                  : "tasks"}
              </CardDescription>
            </CardHeader>

            <CardContent>
              {loading ? (
                <p className="py-6 text-center text-sm text-muted-foreground">
                  Loading…
                </p>
              ) : selectedTasks.length === 0 ? (
                <p className="py-6 text-center text-sm text-muted-foreground">
                  No tasks for this day.
                </p>
              ) : (
                <div className="divide-y divide-border">
                  {selectedTasks.map(
                    (task) => (
                      <TaskRow
                        key={task.id}
                        task={task}
                        onToggle={() =>
                          void toggleTask(task)
                        }
                        onDelete={() =>
                          void removeTask(
                            task.id,
                          )
                        }
                      />
                    ),
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}