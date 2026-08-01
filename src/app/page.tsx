import Link from "next/link";
import { connection } from "next/server";

import { CreateTaskForm } from "@/components/tasks/create-task-form";
import { TaskList } from "@/components/tasks/task-list";

import {
  getTasks,
  isTaskSortOption,
  type TaskSortOption,
} from "@/lib/tasks";

interface HomeProps {
  searchParams: Promise<{
    view?: string | string[];
    sort?: string | string[];
  }>;
}

type TaskView = "active" | "archived";

const SORT_LABELS: Record<TaskSortOption, string> = {
  topic: "topic",
  status: "status",
  dueDate: "due date",
};

function firstQueryValue(
  value: string | string[] | undefined,
): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export default async function Home({
  searchParams,
}: HomeProps) {
  await connection();

  const parameters = await searchParams;

  const requestedView = firstQueryValue(parameters.view);
  const requestedSort = firstQueryValue(parameters.sort);

  const view: TaskView =
    requestedView === "archived"
      ? "archived"
      : "active";

  const sortBy: TaskSortOption =
    requestedSort && isTaskSortOption(requestedSort)
      ? requestedSort
      : "dueDate";

  const activeTasks = getTasks({
    archived: false,
    sortBy,
  });

  const archivedTasks = getTasks({
    archived: true,
    sortBy,
  });

  const visibleTasks =
    view === "archived"
      ? archivedTasks
      : activeTasks;

  const completedTasks = activeTasks.filter(
    (task) => task.status === "Complete",
  ).length;

  const overdueTasks = activeTasks.filter(
    (task) => task.isOverdue,
  ).length;

  const activeHref =
    `/?view=active&sort=${sortBy}`;

  const archivedHref =
    `/?view=archived&sort=${sortBy}`;

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

        <section className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-slate-500">
              Active tasks
            </p>

            <p className="mt-2 text-3xl font-black text-slate-900">
              {activeTasks.length}
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

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-slate-500">
              Archived
            </p>

            <p className="mt-2 text-3xl font-black text-purple-600">
              {archivedTasks.length}
            </p>
          </div>
        </section>

        <div className="grid gap-8 lg:grid-cols-[380px_1fr] lg:items-start">
          <aside className="lg:sticky lg:top-8">
            <CreateTaskForm />
          </aside>

          <section>
            <div className="mb-5 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
                <nav
                  aria-label="Task views"
                  className="inline-flex w-fit rounded-xl bg-slate-100 p-1"
                >
                  <Link
                    href={activeHref}
                    className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
                      view === "active"
                        ? "bg-white text-blue-700 shadow-sm"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    Active ({activeTasks.length})
                  </Link>

                  <Link
                    href={archivedHref}
                    className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
                      view === "archived"
                        ? "bg-white text-purple-700 shadow-sm"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    Archived ({archivedTasks.length})
                  </Link>
                </nav>

                <form
                  method="get"
                  className="flex flex-col gap-2 sm:flex-row sm:items-end"
                >
                  <input
                    type="hidden"
                    name="view"
                    value={view}
                  />

                  <div>
                    <label
                      htmlFor="sort"
                      className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500"
                    >
                      Sort by
                    </label>

                    <select
                      id="sort"
                      name="sort"
                      defaultValue={sortBy}
                      className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 sm:w-44"
                    >
                      <option value="dueDate">
                        Due date
                      </option>

                      <option value="topic">
                        Topic
                      </option>

                      <option value="status">
                        Status
                      </option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-700"
                  >
                    Apply
                  </button>
                </form>
              </div>
            </div>

            <div className="mb-4">
              <p className="text-sm font-semibold uppercase tracking-wider text-slate-500">
                {view === "archived"
                  ? "Archive"
                  : "Active list"}
              </p>

              <h2 className="mt-1 text-2xl font-bold text-slate-900">
                {view === "archived"
                  ? "Archived tasks"
                  : `Tasks by ${SORT_LABELS[sortBy]}`}
              </h2>
            </div>

            <TaskList
              tasks={visibleTasks}
              archived={view === "archived"}
            />
          </section>
        </div>
      </div>
    </main>
  );
}