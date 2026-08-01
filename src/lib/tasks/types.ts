export const TASK_STATUSES = [
  "Todo",
  "In-Progress",
  "Complete",
] as const;

export type TaskStatus = (typeof TASK_STATUSES)[number];

export const TASK_SORT_OPTIONS = [
  "topic",
  "status",
  "dueDate",
] as const;

export type TaskSortOption =
  (typeof TASK_SORT_OPTIONS)[number];

export interface TaskInput {
  title: string;
  description: string;
  dueDate: string;
  topic: string;
  status: TaskStatus;
}

export interface Task extends TaskInput {
  id: number;
  archivedAt: string | null;
  createdAt: string;
  updatedAt: string;
  isOverdue: boolean;
}

export interface ListTaskOptions {
  archived?: boolean;
  sortBy?: TaskSortOption;
}

export type TaskActionStatus =
  | "idle"
  | "success"
  | "error";

export interface TaskActionState {
  status: TaskActionStatus;
  message: string;
}