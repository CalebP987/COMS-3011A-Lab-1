import Database from "better-sqlite3";
import { mkdirSync, readFileSync } from "node:fs";
import path from "node:path";

const schemaPath = path.join(
  process.cwd(),
  "database",
  "schema.sql",
);

export function openDatabase(databasePath: string) {
  if (databasePath !== ":memory:") {
    mkdirSync(path.dirname(databasePath), {
      recursive: true,
    });
  }

  const database = new Database(databasePath, {
    timeout: 5000,
  });

  try {
    database.pragma("foreign_keys = ON");

    if (databasePath !== ":memory:") {
      database.pragma("journal_mode = WAL");
    }

    const schema = readFileSync(schemaPath, "utf8");
    database.exec(schema);

    return database;
  } catch (error) {
    database.close();
    throw error;
  }
}