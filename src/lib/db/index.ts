import "server-only";

import path from "node:path";

import { openDatabase } from "./database";

const databasePath =
  process.env.DATABASE_PATH ??
  path.join(process.cwd(), "data", "tasks.db");

const globalForDatabase = globalThis as typeof globalThis & {
  taskDatabase?: ReturnType<typeof openDatabase>;
};

export const db =
  globalForDatabase.taskDatabase ??
  openDatabase(databasePath);

if (process.env.NODE_ENV !== "production") {
  globalForDatabase.taskDatabase = db;
}