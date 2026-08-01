"use client";

import { useActionState, useState } from "react";

import {
  archiveTaskAction,
  editTaskAction,
} from "@/app/actions";

import {
  TASK_STATUSES,
  type Task,
  type TaskActionState,
} from "@/lib/tasks/types";

interface TaskCardProps {
  task: Task;
}

const initialState: TaskActionState = {
  status: "idle",
  message: "",
};

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

function formatArchivedDate(timestamp: string): string {
  const normalisedTimestamp = timestamp.includes("T")
    ? timestamp
    : `${timestamp.replace(" ", "T")}Z`;

  const date = new Date(normalisedTimestamp);

  if (Number.isNaN(date.getTime())) {
    return timestamp;
  }

  return new Intl.DateTimeFormat("en-ZA", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
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

export function TaskCard({ task }: TaskCardProps) {
  const [isEditing, setIsEditing] = useState(false);

  const [
    editState,
    editFormAction,
    isEditPending,
  ] = useActionState(editTaskAction, initialState);

  const [
    archiveState,
    archiveFormAction,
    isArchivePending,
  ] = useActionState(archiveTaskAction, initialState);

  const isArchived = task.archivedAt !== null;

  if (isEditing && !isArchived) {
    return (
      <article className="rounded-2xl border border-blue-300 bg-white p-5 shadow-sm">
        <div className="mb-5">
          <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
            Editing task
          </p>

          <h3 className="mt-1 text-xl font-bold text-slate-900">
            Update task #{task.id}
          </h3>
        </div>

        <form action={editFormAction}>
          <input
            type="hidden"
            name="taskId"
            value={task.id}
          />

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label
                htmlFor={`edit-title-${task.id}`}
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Title
              </label>

              <input
                id={`edit-title-${task.id}`}
                name="title"
                type="text"
                required
                maxLength={120}
                defaultValue={task.title}
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              />
            </div>

            <div className="sm:col-span-2">
              <label
                htmlFor={`edit-description-${task.id}`}
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Description
              </label>

              <textarea
                id={`edit-description-${task.id}`}
                name="description"
                rows={3}
                maxLength={1000}
                defaultValue={task.description}
                className="w-full resize-y rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              />
            </div>

            <div>
              <label
                htmlFor={`edit-due-date-${task.id}`}
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Due date
              </label>

              <input
                id={`edit-due-date-${task.id}`}
                name="dueDate"
                type="date"
                required
                defaultValue={task.dueDate}
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              />
            </div>

            <div>
              <label
                htmlFor={`edit-topic-${task.id}`}
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Topic
              </label>

              <input
                id={`edit-topic-${task.id}`}
                name="topic"
                type="text"
                required
                maxLength={80}
                defaultValue={task.topic}
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              />
            </div>

            <div className="sm:col-span-2">
              <label
                htmlFor={`edit-status-${task.id}`}
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Status
              </label>

              <select
                id={`edit-status-${task.id}`}
                name="status"
                defaultValue={task.status}
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

          {editState.message && (
            <p
              role={
                editState.status === "error"
                  ? "alert"
                  : "status"
              }
              className={`mt-4 rounded-xl px-4 py-3 text-sm font-medium ${
                editState.status === "error"
                  ? "bg-red-50 text-red-700"
                  : "bg-emerald-50 text-emerald-700"
              }`}
            >
              {editState.message}
            </p>
          )}

          <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              disabled={isEditPending}
              onClick={() => setIsEditing(false)}
              className="rounded-xl border border-slate-300 px-5 py-2.5 font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isEditPending}
              className="rounded-xl bg-blue-600 px-5 py-2.5 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
            >
              {isEditPending
                ? "Saving changes..."
                : "Save changes"}
            </button>
          </div>
        </form>
      </article>
    );
  }

  return (
    <article
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

            {isArchived && (
              <span className="rounded-full bg-purple-100 px-3 py-1 text-xs font-semibold text-purple-700">
                Archived
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

          {task.archivedAt && (
            <p className="mt-3 text-xs font-medium text-purple-700">
              Archived{" "}
              {formatArchivedDate(task.archivedAt)}
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

      {!isArchived && (
        <div className="mt-5 border-t border-slate-100 pt-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="rounded-xl border border-blue-200 px-4 py-2 text-sm font-semibold text-blue-700 transition hover:bg-blue-50"
            >
              Edit
            </button>

            <form action={archiveFormAction}>
              <input
                type="hidden"
                name="taskId"
                value={task.id}
              />

              <button
                type="submit"
                disabled={isArchivePending}
                className="w-full rounded-xl border border-purple-200 px-4 py-2 text-sm font-semibold text-purple-700 transition hover:bg-purple-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isArchivePending
                  ? "Archiving..."
                  : "Archive"}
              </button>
            </form>
          </div>

          {archiveState.message && (
            <p
              role={
                archiveState.status === "error"
                  ? "alert"
                  : "status"
              }
              className={`mt-3 rounded-xl px-4 py-3 text-sm font-medium ${
                archiveState.status === "error"
                  ? "bg-red-50 text-red-700"
                  : "bg-emerald-50 text-emerald-700"
              }`}
            >
              {archiveState.message}
            </p>
          )}
        </div>
      )}
    </article>
  );
}