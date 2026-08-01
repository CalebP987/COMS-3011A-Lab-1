import { connection } from "next/server";

import { CreateTaskForm } from "@/components/tasks/create-task-form";
import { TaskList } from "@/components/tasks/task-list";
import { getTasks } from "@/lib/tasks";

export default async function Home() {
  await connection();

  const tasks = getTasks({
    archived: false,
    sortBy: "dueDate",
  });

  const completedTasks = tasks.filter(
    (task) => task.status === "Complete",
  ).length;

  const overdueTasks = tasks.filter(
    (task) => task.isOverdue,
  ).length;

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-600">
            Local task manager
          </p>

          <h1 className="mt-2 text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">
            My tasks
          </h1>

          <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">
            Create and organise tasks stored locally on this
            computer.
          </p>
        </header>

        <section className="mb-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-slate-500">
              Active tasks
            </p>

            <p className="mt-2 text-3xl font-black text-slate-900">
              {tasks.length}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-slate-500">
              Complete
            </p>

            <p className="mt-2 text-3xl font-black text-emerald-600">
              {completedTasks}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-slate-500">
              Overdue
            </p>

            <p className="mt-2 text-3xl font-black text-red-600">
              {overdueTasks}
            </p>
          </div>
        </section>

        <div className="grid gap-8 lg:grid-cols-[380px_1fr] lg:items-start">
          <aside className="lg:sticky lg:top-8">
            <CreateTaskForm />
          </aside>

          <section>
            <div className="mb-4 flex items-end justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-wider text-slate-500">
                  Active list
                </p>

                <h2 className="mt-1 text-2xl font-bold text-slate-900">
                  Tasks by due date
                </h2>
              </div>
            </div>

            <TaskList tasks={tasks} />
          </section>
        </div>
      </div>
    </main>
  );
}