import type { Task } from "@/lib/tasks/types";

interface TaskListProps {
  tasks: Task[];
}

function formatDueDate(dueDate: string): string {
  const [year, month, day] = dueDate
    .split("-")
    .map(Number);

  return new Intl.DateTimeFormat("en-ZA", {
    dateStyle: "medium",
    timeZone: "UTC",
  }).format(
    new Date(Date.UTC(year, month - 1, day)),
  );
}

function statusClasses(status: Task["status"]): string {
  switch (status) {
    case "Todo":
      return "bg-slate-100 text-slate-700";

    case "In-Progress":
      return "bg-amber-100 text-amber-800";

    case "Complete":
      return "bg-emerald-100 text-emerald-800";
  }
}

export function TaskList({ tasks }: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-2xl">
          ✓
        </div>

        <h2 className="mt-4 text-xl font-bold text-slate-900">
          No active tasks
        </h2>

        <p className="mt-2 text-sm text-slate-600">
          Create your first task using the form.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <article
          key={task.id}
          className={`rounded-2xl border bg-white p-5 shadow-sm ${
            task.isOverdue
              ? "border-red-300"
              : "border-slate-200"
          }`}
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                  {task.topic}
                </span>

                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${statusClasses(
                    task.status,
                  )}`}
                >
                  {task.status}
                </span>

                {task.isOverdue && (
                  <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">
                    Overdue
                  </span>
                )}
              </div>

              <h3 className="mt-3 break-words text-xl font-bold text-slate-900">
                {task.title}
              </h3>

              {task.description ? (
                <p className="mt-2 whitespace-pre-wrap break-words text-sm leading-6 text-slate-600">
                  {task.description}
                </p>
              ) : (
                <p className="mt-2 text-sm italic text-slate-400">
                  No description provided.
                </p>
              )}
            </div>

            <div
              className={`shrink-0 rounded-xl px-4 py-3 text-sm ${
                task.isOverdue
                  ? "bg-red-50 text-red-700"
                  : "bg-slate-50 text-slate-600"
              }`}
            >
              <p className="text-xs font-semibold uppercase tracking-wide">
                Due
              </p>

              <p className="mt-1 font-bold">
                {formatDueDate(task.dueDate)}
              </p>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}