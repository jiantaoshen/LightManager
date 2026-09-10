/**
 * File: pages/today.tsx
 * Purpose: Shows today's scheduled tasks and unscheduled tasks in one daily workspace.
 * Component: TodayPage.
 */

import { QuickAdd } from "../components/tasks/quick-add";
import { TaskListCard } from "../components/tasks/task-list-card";
import { usePersonalTasks } from "../hooks/usePersonalTasks";
import { todayKey } from "../lib/date";
import {
  getCompletedTasks,
  getOpenTasks,
  getTasksForDate,
  getUnscheduledTasks,
} from "../lib/task";

export default function TodayPage() {
  const { tasks, loading, error, addTask, toggleTask, removeTask } = usePersonalTasks();
  const todayTasks = getTasksForDate(tasks, todayKey());
  const openTodayTasks = getOpenTasks(todayTasks);
  const completedTodayTasks = getCompletedTasks(todayTasks);
  const unscheduledTasks = getUnscheduledTasks(tasks);
  const orderedTodayTasks = [...openTodayTasks, ...completedTodayTasks];

  return (
    <div className="space-y-6">
      
      <QuickAdd onAdd={addTask} />

      {error && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
          {error}
        </div>
      )}

      <TaskListCard
        title="Today"
        description={`${openTodayTasks.length} open · ${completedTodayTasks.length} completed`}
        tasks={orderedTodayTasks}
        loading={loading}
        emptyTitle="Nothing planned for today."
        emptyDescription="Add a due date when you want to schedule a task for today."
        onToggle={(task) => void toggleTask(task)}
        onDelete={(taskId) => void removeTask(taskId)}
      />

      <TaskListCard
        title="Unscheduled"
        description={`${unscheduledTasks.length} ${unscheduledTasks.length === 1 ? "task" : "tasks"}`}
        tasks={unscheduledTasks}
        loading={loading}
        emptyTitle="No unscheduled tasks."
        emptyDescription="Tasks created without a due date will appear here."
        onToggle={(task) => void toggleTask(task)}
        onDelete={(taskId) => void removeTask(taskId)}
      />
    </div>
  );
}
