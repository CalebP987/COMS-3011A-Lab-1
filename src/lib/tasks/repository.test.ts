import type Database from "better-sqlite3";
import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
} from "vitest";

import { openDatabase } from "../db/database";

import {
  archiveTask,
  createTask,
  listTasks,
  updateTask,
} from "./repository";

import type { TaskInput } from "./types";

let database: Database.Database;

function makeTask(
  overrides: Partial<TaskInput> = {},
): TaskInput {
  return {
    title: "Complete the lab",
    description: "Finish the remaining SDP work.",
    dueDate: "2026-08-10",
    topic: "University",
    status: "Todo",
    ...overrides,
  };
}

beforeEach(() => {
  database = openDatabase(":memory:");
});

afterEach(() => {
  database.close();
});

describe("task repository", () => {
  it("creates and retrieves a task with normalised input", () => {
    const createdTask = createTask(
      database,
      makeTask({
        title: "  Complete the lab  ",
        description: "  Finish the remaining work.  ",
        topic: "  University  ",
      }),
    );

    expect(createdTask.id).toBeGreaterThan(0);
    expect(createdTask).toMatchObject({
      title: "Complete the lab",
      description: "Finish the remaining work.",
      dueDate: "2026-08-10",
      topic: "University",
      status: "Todo",
      archivedAt: null,
    });

    const activeTasks = listTasks(database);

    expect(activeTasks).toHaveLength(1);
    expect(activeTasks[0].id).toBe(createdTask.id);
  });

  it("updates an existing active task", () => {
    const createdTask = createTask(
      database,
      makeTask(),
    );

    const updatedTask = updateTask(
      database,
      createdTask.id,
      makeTask({
        title: "Submit the lab",
        description: "Upload the final repository.",
        dueDate: "2026-08-04",
        topic: "SDP",
        status: "In-Progress",
      }),
    );

    expect(updatedTask).toMatchObject({
      id: createdTask.id,
      title: "Submit the lab",
      description: "Upload the final repository.",
      dueDate: "2026-08-04",
      topic: "SDP",
      status: "In-Progress",
      archivedAt: null,
    });

    const storedTask = listTasks(database)[0];

    expect(storedTask).toMatchObject({
      title: "Submit the lab",
      topic: "SDP",
      status: "In-Progress",
    });
  });

  it("archives a task without deleting it", () => {
    const archivedCandidate = createTask(
      database,
      makeTask({
        title: "Archive this task",
      }),
    );

    const remainingTask = createTask(
      database,
      makeTask({
        title: "Keep this task active",
      }),
    );

    const archivedTask = archiveTask(
      database,
      archivedCandidate.id,
    );

    expect(archivedTask.archivedAt).not.toBeNull();

    const activeTasks = listTasks(database, {
      archived: false,
    });

    const archivedTasks = listTasks(database, {
      archived: true,
    });

    expect(activeTasks.map((task) => task.id)).toEqual([
      remainingTask.id,
    ]);

    expect(archivedTasks).toHaveLength(1);
    expect(archivedTasks[0].id).toBe(
      archivedCandidate.id,
    );
    expect(archivedTasks[0].title).toBe(
      "Archive this task",
    );
  });

  it("derives overdue state from the due date and status", () => {
    const currentDate = new Date(
      2026,
      7,
      2,
      12,
      0,
      0,
    );

    const overdueTask = createTask(
      database,
      makeTask({
        title: "Past todo task",
        dueDate: "2026-08-01",
        status: "Todo",
      }),
    );

    const completedTask = createTask(
      database,
      makeTask({
        title: "Past completed task",
        dueDate: "2026-08-01",
        status: "Complete",
      }),
    );

    const todayTask = createTask(
      database,
      makeTask({
        title: "Task due today",
        dueDate: "2026-08-02",
        status: "In-Progress",
      }),
    );

    const tasks = listTasks(
      database,
      {
        archived: false,
        sortBy: "dueDate",
      },
      currentDate,
    );

    const overdueResult = tasks.find(
      (task) => task.id === overdueTask.id,
    );

    const completedResult = tasks.find(
      (task) => task.id === completedTask.id,
    );

    const todayResult = tasks.find(
      (task) => task.id === todayTask.id,
    );

    expect(overdueResult?.isOverdue).toBe(true);
    expect(completedResult?.isOverdue).toBe(false);
    expect(todayResult?.isOverdue).toBe(false);
  });

  it("sorts tasks by topic, status and due date", () => {
    createTask(
      database,
      makeTask({
        title: "Zebra topic",
        topic: "Zebra",
        status: "Complete",
        dueDate: "2026-08-12",
      }),
    );

    createTask(
      database,
      makeTask({
        title: "Alpha topic",
        topic: "Alpha",
        status: "Todo",
        dueDate: "2026-08-10",
      }),
    );

    createTask(
      database,
      makeTask({
        title: "Middle topic",
        topic: "Middle",
        status: "In-Progress",
        dueDate: "2026-08-11",
      }),
    );

    const byTopic = listTasks(database, {
      sortBy: "topic",
    });

    const byStatus = listTasks(database, {
      sortBy: "status",
    });

    const byDueDate = listTasks(database, {
      sortBy: "dueDate",
    });

    expect(byTopic.map((task) => task.topic)).toEqual([
      "Alpha",
      "Middle",
      "Zebra",
    ]);

    expect(byStatus.map((task) => task.status)).toEqual([
      "Todo",
      "In-Progress",
      "Complete",
    ]);

    expect(
      byDueDate.map((task) => task.dueDate),
    ).toEqual([
      "2026-08-10",
      "2026-08-11",
      "2026-08-12",
    ]);
  });
});