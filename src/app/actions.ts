"use server";

import { revalidatePath } from "next/cache";

import {
  addTask,
  isTaskStatus,
  TaskValidationError,
} from "@/lib/tasks";
import type { TaskActionState } from "@/lib/tasks/types";

export async function createTaskAction(
  _previousState: TaskActionState,
  formData: FormData,
): Promise<TaskActionState> {
  const status = String(formData.get("status") ?? "");

  if (!isTaskStatus(status)) {
    return {
      status: "error",
      message: "The selected task status is invalid.",
    };
  }

  try {
    addTask({
      title: String(formData.get("title") ?? ""),
      description: String(
        formData.get("description") ?? "",
      ),
      dueDate: String(formData.get("dueDate") ?? ""),
      topic: String(formData.get("topic") ?? ""),
      status,
    });

    revalidatePath("/");

    return {
      status: "success",
      message: "Task created successfully.",
    };
  } catch (error) {
    if (error instanceof TaskValidationError) {
      return {
        status: "error",
        message: error.message,
      };
    }

    console.error("Failed to create task:", error);

    return {
      status: "error",
      message:
        "The task could not be created. Please try again.",
    };
  }
}