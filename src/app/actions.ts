"use server";

import { revalidatePath } from "next/cache";

import {
  addTask,
  archiveTask as archiveTaskInDatabase,
  editTask,
  isTaskStatus,
  TaskNotFoundError,
  TaskValidationError,
} from "@/lib/tasks";

import type {
  TaskActionState,
  TaskInput,
} from "@/lib/tasks/types";

function readTaskId(formData: FormData): number | null {
  const id = Number(formData.get("taskId"));

  if (!Number.isInteger(id) || id <= 0) {
    return null;
  }

  return id;
}

function readTaskInput(
  formData: FormData,
): TaskInput | null {
  const status = String(formData.get("status") ?? "");

  if (!isTaskStatus(status)) {
    return null;
  }

  return {
    title: String(formData.get("title") ?? ""),
    description: String(
      formData.get("description") ?? "",
    ),
    dueDate: String(formData.get("dueDate") ?? ""),
    topic: String(formData.get("topic") ?? ""),
    status,
  };
}

function handleTaskError(
  error: unknown,
  fallbackMessage: string,
  consoleMessage: string,
): TaskActionState {
  if (
    error instanceof TaskValidationError ||
    error instanceof TaskNotFoundError
  ) {
    return {
      status: "error",
      message: error.message,
    };
  }

  console.error(consoleMessage, error);

  return {
    status: "error",
    message: fallbackMessage,
  };
}

export async function createTaskAction(
  _previousState: TaskActionState,
  formData: FormData,
): Promise<TaskActionState> {
  const input = readTaskInput(formData);

  if (!input) {
    return {
      status: "error",
      message: "The selected task status is invalid.",
    };
  }

  try {
    addTask(input);

    revalidatePath("/");

    return {
      status: "success",
      message: "Task created successfully.",
    };
  } catch (error) {
    return handleTaskError(
      error,
      "The task could not be created. Please try again.",
      "Failed to create task:",
    );
  }
}

export async function editTaskAction(
  _previousState: TaskActionState,
  formData: FormData,
): Promise<TaskActionState> {
  const taskId = readTaskId(formData);
  const input = readTaskInput(formData);

  if (!taskId) {
    return {
      status: "error",
      message: "The task identifier is invalid.",
    };
  }

  if (!input) {
    return {
      status: "error",
      message: "The selected task status is invalid.",
    };
  }

  try {
    editTask(taskId, input);

    revalidatePath("/");

    return {
      status: "success",
      message: "Task updated successfully.",
    };
  } catch (error) {
    return handleTaskError(
      error,
      "The task could not be updated. Please try again.",
      "Failed to update task:",
    );
  }
}

export async function archiveTaskAction(
  _previousState: TaskActionState,
  formData: FormData,
): Promise<TaskActionState> {
  const taskId = readTaskId(formData);

  if (!taskId) {
    return {
      status: "error",
      message: "The task identifier is invalid.",
    };
  }

  try {
    archiveTaskInDatabase(taskId);

    revalidatePath("/");

    return {
      status: "success",
      message: "Task archived successfully.",
    };
  } catch (error) {
    return handleTaskError(
      error,
      "The task could not be archived. Please try again.",
      "Failed to archive task:",
    );
  }
}