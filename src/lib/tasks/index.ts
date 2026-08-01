import { db } from "@/lib/db";

import {
  archiveTask as archiveTaskInDatabase,
  createTask as createTaskInDatabase,
  findTaskById as findTaskByIdInDatabase,
  listTasks as listTasksInDatabase,
  updateTask as updateTaskInDatabase,
} from "./repository";
import type {
  ListTaskOptions,
  TaskInput,
} from "./types";

export function getTasks(options?: ListTaskOptions) {
  return listTasksInDatabase(db, options);
}

export function getTask(id: number) {
  return findTaskByIdInDatabase(db, id);
}

export function addTask(input: TaskInput) {
  return createTaskInDatabase(db, input);
}

export function editTask(id: number, input: TaskInput) {
  return updateTaskInDatabase(db, id, input);
}

export function archiveTask(id: number) {
  return archiveTaskInDatabase(db, id);
}

export * from "./types";
export {
  isTaskOverdue,
  isTaskSortOption,
  isTaskStatus,
  isValidDateString,
  TaskValidationError,
} from "./validation";

export { TaskNotFoundError } from "./repository";