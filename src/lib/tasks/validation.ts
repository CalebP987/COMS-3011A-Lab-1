import {
  TASK_SORT_OPTIONS,
  TASK_STATUSES,
  type TaskInput,
  type TaskSortOption,
  type TaskStatus,
} from "./types";

export class TaskValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "TaskValidationError";
  }
}

export function isTaskStatus(
  value: string,
): value is TaskStatus {
  return TASK_STATUSES.some((status) => status === value);
}

export function isTaskSortOption(
  value: string,
): value is TaskSortOption {
  return TASK_SORT_OPTIONS.some((option) => option === value);
}

export function isValidDateString(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }

  const [year, month, day] = value
    .split("-")
    .map(Number);

  const date = new Date(Date.UTC(year, month - 1, day));

  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
}

export function validateTaskInput(
  input: TaskInput,
): TaskInput {
  const title = input.title.trim();
  const description = input.description.trim();
  const topic = input.topic.trim();
  const dueDate = input.dueDate.trim();

  if (title.length === 0) {
    throw new TaskValidationError(
      "A task title is required.",
    );
  }

  if (topic.length === 0) {
    throw new TaskValidationError(
      "A task topic is required.",
    );
  }

  if (!isValidDateString(dueDate)) {
    throw new TaskValidationError(
      "The due date must be a valid date.",
    );
  }

  if (!isTaskStatus(input.status)) {
    throw new TaskValidationError(
      "The task status is invalid.",
    );
  }

  return {
    title,
    description,
    topic,
    dueDate,
    status: input.status,
  };
}

function localDateString(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(
    2,
    "0",
  );
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function isTaskOverdue(
  dueDate: string,
  status: TaskStatus,
  currentDate = new Date(),
): boolean {
  return (
    status !== "Complete" &&
    dueDate < localDateString(currentDate)
  );
}