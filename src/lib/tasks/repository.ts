import type Database from "better-sqlite3";

import {
  type ListTaskOptions,
  type Task,
  type TaskInput,
  type TaskSortOption,
  type TaskStatus,
} from "./types";
import {
  isTaskOverdue,
  validateTaskInput,
} from "./validation";

interface TaskRow {
  id: number;
  title: string;
  description: string;
  due_date: string;
  topic: string;
  status: TaskStatus;
  archived_at: string | null;
  created_at: string;
  updated_at: string;
}

export class TaskNotFoundError extends Error {
  constructor(id: number) {
    super(`Task ${id} was not found.`);
    this.name = "TaskNotFoundError";
  }
}

function mapTaskRow(
  row: TaskRow,
  currentDate = new Date(),
): Task {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    dueDate: row.due_date,
    topic: row.topic,
    status: row.status,
    archivedAt: row.archived_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    isOverdue: isTaskOverdue(
      row.due_date,
      row.status,
      currentDate,
    ),
  };
}

function orderByClause(
  sortBy: TaskSortOption,
): string {
  switch (sortBy) {
    case "topic":
      return `
        topic COLLATE NOCASE ASC,
        due_date ASC,
        id ASC
      `;

    case "status":
      return `
        CASE status
          WHEN 'Todo' THEN 1
          WHEN 'In-Progress' THEN 2
          WHEN 'Complete' THEN 3
        END ASC,
        due_date ASC,
        id ASC
      `;

    case "dueDate":
      return `
        due_date ASC,
        id ASC
      `;
  }
}

export function listTasks(
  database: Database.Database,
  options: ListTaskOptions = {},
  currentDate = new Date(),
): Task[] {
  const archived = options.archived ?? false;
  const sortBy = options.sortBy ?? "dueDate";

  const archiveCondition = archived
    ? "archived_at IS NOT NULL"
    : "archived_at IS NULL";

  const statement = database.prepare(`
    SELECT
      id,
      title,
      description,
      due_date,
      topic,
      status,
      archived_at,
      created_at,
      updated_at
    FROM tasks
    WHERE ${archiveCondition}
    ORDER BY ${orderByClause(sortBy)}
  `);

  return (statement.all() as TaskRow[]).map((row) =>
    mapTaskRow(row, currentDate),
  );
}

export function findTaskById(
  database: Database.Database,
  id: number,
  currentDate = new Date(),
): Task | null {
  const statement = database.prepare(`
    SELECT
      id,
      title,
      description,
      due_date,
      topic,
      status,
      archived_at,
      created_at,
      updated_at
    FROM tasks
    WHERE id = ?
  `);

  const row = statement.get(id) as TaskRow | undefined;

  return row ? mapTaskRow(row, currentDate) : null;
}

export function createTask(
  database: Database.Database,
  input: TaskInput,
): Task {
  const task = validateTaskInput(input);

  const statement = database.prepare(`
    INSERT INTO tasks (
      title,
      description,
      due_date,
      topic,
      status
    )
    VALUES (?, ?, ?, ?, ?)
  `);

  const result = statement.run(
    task.title,
    task.description,
    task.dueDate,
    task.topic,
    task.status,
  );

  const createdTask = findTaskById(
    database,
    Number(result.lastInsertRowid),
  );

  if (!createdTask) {
    throw new Error("The created task could not be loaded.");
  }

  return createdTask;
}

export function updateTask(
  database: Database.Database,
  id: number,
  input: TaskInput,
): Task {
  const task = validateTaskInput(input);

  const statement = database.prepare(`
    UPDATE tasks
    SET
      title = ?,
      description = ?,
      due_date = ?,
      topic = ?,
      status = ?,
      updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
      AND archived_at IS NULL
  `);

  const result = statement.run(
    task.title,
    task.description,
    task.dueDate,
    task.topic,
    task.status,
    id,
  );

  if (result.changes === 0) {
    throw new TaskNotFoundError(id);
  }

  const updatedTask = findTaskById(database, id);

  if (!updatedTask) {
    throw new TaskNotFoundError(id);
  }

  return updatedTask;
}

export function archiveTask(
  database: Database.Database,
  id: number,
): Task {
  const statement = database.prepare(`
    UPDATE tasks
    SET
      archived_at = CURRENT_TIMESTAMP,
      updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
      AND archived_at IS NULL
  `);

  const result = statement.run(id);

  if (result.changes === 0) {
    throw new TaskNotFoundError(id);
  }

  const archivedTask = findTaskById(database, id);

  if (!archivedTask) {
    throw new TaskNotFoundError(id);
  }

  return archivedTask;
}