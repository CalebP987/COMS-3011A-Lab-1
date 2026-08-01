"use client";

import { useActionState } from "react";

import { createTaskAction } from "@/app/actions";
import { TASK_STATUSES } from "@/lib/tasks/types";
import type { TaskActionState } from "@/lib/tasks/types";

const initialState: TaskActionState = {
  status: "idle",
  message: "",
};

export function CreateTaskForm() {
  const [state, formAction, isPending] = useActionState(
    createTaskAction,
    initialState,
  );

  return (
    <form
      action={formAction}
      className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      <div className="mb-6">
        <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
          New task
        </p>

        <h2 className="mt-1 text-2xl font-bold text-slate-900">
          Add something to your list
        </h2>

        <p className="mt-2 text-sm text-slate-600">
          Enter the task information and choose its current
          status.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div className="md:col-span-2">
          <label
            htmlFor="title"
            className="mb-2 block text-sm font-semibold text-slate-700"
          >
            Title
          </label>

          <input
            id="title"
            name="title"
            type="text"
            required
            maxLength={120}
            placeholder="e.g. Complete SDP lab"
            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
          />
        </div>

        <div className="md:col-span-2">
          <label
            htmlFor="description"
            className="mb-2 block text-sm font-semibold text-slate-700"
          >
            Description
          </label>

          <textarea
            id="description"
            name="description"
            rows={4}
            maxLength={1000}
            placeholder="Add any useful details about the task"
            className="w-full resize-y rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
          />
        </div>

        <div>
          <label
            htmlFor="dueDate"
            className="mb-2 block text-sm font-semibold text-slate-700"
          >
            Due date
          </label>

          <input
            id="dueDate"
            name="dueDate"
            type="date"
            required
            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
          />
        </div>

        <div>
          <label
            htmlFor="topic"
            className="mb-2 block text-sm font-semibold text-slate-700"
          >
            Topic
          </label>

          <input
            id="topic"
            name="topic"
            type="text"
            required
            maxLength={80}
            placeholder="e.g. University"
            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
          />
        </div>

        <div className="md:col-span-2">
          <label
            htmlFor="status"
            className="mb-2 block text-sm font-semibold text-slate-700"
          >
            Status
          </label>

          <select
            id="status"
            name="status"
            defaultValue="Todo"
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
          >
            {TASK_STATUSES.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>
      </div>

      {state.message && (
        <p
          role={state.status === "error" ? "alert" : "status"}
          className={`mt-5 rounded-xl px-4 py-3 text-sm font-medium ${
            state.status === "error"
              ? "bg-red-50 text-red-700"
              : "bg-emerald-50 text-emerald-700"
          }`}
        >
          {state.message}
        </p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="mt-6 w-full rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
      >
        {isPending ? "Creating task..." : "Create task"}
      </button>
    </form>
  );
}