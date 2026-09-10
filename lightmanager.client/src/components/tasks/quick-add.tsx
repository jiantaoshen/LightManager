import { useState } from "react";
import type { PersonalTaskDraft, Priority } from "../../interfaces/ITask";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Input } from "../ui/input";

export function QuickAdd({ defaultDate, onAdd }: { defaultDate?: string; onAdd: (draft: PersonalTaskDraft) => Promise<unknown> }) {
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState(defaultDate ?? "");
  const [priority, setPriority] = useState<Priority>("Medium");
  const [saving, setSaving] = useState(false);

  const submit = async (
    event: React.SubmitEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();
    if (!title.trim()) return;
    setSaving(true);
    try {
      await onAdd({ title, priority, dueDate: dueDate || null });
      setTitle("");
      if (!defaultDate) setDueDate("");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card className="p-3 sm:p-4">
      <form onSubmit={submit} className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <Input
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Add a task…"
          aria-label="Task title"
          className="border-0 shadow-none focus-visible:ring-0"
        />
        <div className="flex gap-2">
          <Input
            type="date"
            value={dueDate}
            onChange={(event) => setDueDate(event.target.value)}
            aria-label="Due date"
            className="w-full sm:w-40"
          />
          <select
            value={priority}
            onChange={(event) => setPriority(event.target.value as Priority)}
            className="h-10 rounded-md border border-input bg-background px-3 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
            aria-label="Priority"
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
          <Button type="submit" disabled={saving || !title.trim()}>
            {saving ? "Adding…" : "Add"}
          </Button>
        </div>
      </form>
    </Card>
  );
}
