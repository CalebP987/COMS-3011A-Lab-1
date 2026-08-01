import { TaskCard } from "./task-card";

import type { Task } from "@/lib/tasks/types";

interface TaskListProps {
  tasks: Task[];
  archived: boolean;
}

export function TaskList({
  tasks,
  archived,
}: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-2xl">
          {archived ? "□" : "✓"}
        </div>

        <h2 className="mt-4 text-xl font-bold text-slate-900">
          {archived
            ? "No archived tasks"
            : "No active tasks"}
        </h2>

        <p className="mt-2 text-sm text-slate-600">
          {archived
            ? "Tasks you archive will remain viewable here."
            : "Create your first task using the form."}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <TaskCard
          key={[
            task.id,
            task.title,
            task.description,
            task.dueDate,
            task.topic,
            task.status,
            task.archivedAt,
          ].join("-")}
          task={task}
        />
      ))}
    </div>
  );
}