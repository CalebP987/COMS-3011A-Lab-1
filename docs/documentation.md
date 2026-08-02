# Project Documentation

## Third-Party Code

The following direct dependencies and development dependencies are installed by this project.

| Package | Reason for Use |
|---|---|
| `next` | Provides the application framework, App Router, Server Components and Server Actions. |
| `react` | Provides the component-based user interface system used by Next.js. |
| `react-dom` | Renders React components and supports React server rendering. |
| `better-sqlite3` | Provides synchronous server-side access to the local SQLite database. |
| `vitest` | Runs the automated behavioural tests. |
| `typescript` | Provides static type checking for the application and database code. |
| `tailwindcss` | Provides utility classes used to style the user interface. |
| `@tailwindcss/postcss` | Integrates Tailwind CSS with the PostCSS build process. |
| `eslint` | Performs static analysis and identifies code-quality problems. |
| `eslint-config-next` | Supplies the recommended ESLint rules for Next.js. |
| `@types/node` | Provides TypeScript definitions for Node.js APIs. |
| `@types/react` | Provides TypeScript definitions for React. |
| `@types/react-dom` | Provides TypeScript definitions for React DOM. |
| `@types/better-sqlite3` | Provides TypeScript definitions for `better-sqlite3`. |

Installed packages are recorded in `package.json`. Exact resolved versions are recorded in `package-lock.json`.

## Database Design

The application uses SQLite and contains one table named `tasks`.

### Tasks Table

| Column | Type | Description |
|---|---|---|
| `id` | `INTEGER` | Auto-incrementing primary key that uniquely identifies a task. |
| `title` | `TEXT` | Required task title. Empty or whitespace-only titles are rejected. |
| `description` | `TEXT` | Additional task details. Defaults to an empty string. |
| `due_date` | `TEXT` | Required date stored in `YYYY-MM-DD` format. |
| `topic` | `TEXT` | Required task topic used for display and sorting. |
| `status` | `TEXT` | Restricted to `Todo`, `In-Progress` or `Complete`. |
| `archived_at` | `TEXT` or `NULL` | Archive timestamp. `NULL` means that the task is active. |
| `created_at` | `TEXT` | Timestamp recorded when the task is created. |
| `updated_at` | `TEXT` | Timestamp updated when the task is edited or archived. |

### Relationships

There are no relationships between tables because the application requires only one table.

Topics are stored directly on tasks because topics are simple attributes and are not independently managed.

Statuses are also stored directly on tasks. A database constraint restricts them to the three fixed values required by the brief.

### Archiving

Archived tasks remain in the `tasks` table.

When a task is archived, the application sets `archived_at` to a timestamp. Active tasks have an `archived_at` value of `NULL`.

Tasks are never deleted or moved into a separate archive table.

### Overdue Calculation

Overdue is not stored as a database column or task status.

It is calculated when a task is read. A task is overdue when:

1. Its due date is earlier than the current local date.
2. Its status is not `Complete`.

A task due on the current date is not overdue. A completed task is not shown as overdue, even when its due date has passed.

### Indexes

The schema contains indexes on:

- `topic`
- `status`
- `due_date`
- `archived_at`

These support sorting and active/archive filtering.

### Database Location

The application database is stored at:

~~~text
data/tasks.db
~~~

The `data` directory and generated SQLite files are excluded from Git.

A new database is created automatically using `database/schema.sql` when the application runs from a clean clone.

Tests do not use the development database. Each test uses a new in-memory SQLite database that is discarded after the test.

## Running It

### Required Software

The project was developed and verified using:

~~~text
Node.js v24.13.1
npm 11.8.0
~~~

### Starting From a Clean Clone

Clone the repository:

~~~bash
git clone https://github.com/CalebP987/COMS-3011A-Lab-1.git
~~~

Enter the repository:

~~~bash
cd COMS-3011A-Lab-1
~~~

Install the exact dependencies from `package-lock.json`:

~~~bash
npm ci
~~~

Start the development server:

~~~bash
npm run dev
~~~

Open:

~~~text
http://localhost:3000
~~~

The database directory, database file and task table are created automatically when the application first loads.

### Running Automated Tests

Run all tests with:

~~~bash
npm test
~~~

The test suite covers:

- Task creation and retrieval.
- Task editing.
- Task archiving without deletion.
- Overdue-state calculation.
- Sorting by topic, status and due date.

Each test uses an isolated in-memory SQLite database.

### Linting

~~~bash
npm run lint
~~~

### Production Build

Create an optimised production build:

~~~bash
npm run build
~~~

Start the production server:

~~~bash
npm start
~~~

Open:

~~~text
http://localhost:3000
~~~

### Available npm Commands

| Command | Purpose |
|---|---|
| `npm run dev` | Starts the Next.js development server. |
| `npm run build` | Creates an optimised production build. |
| `npm start` | Runs the production build. |
| `npm run lint` | Runs ESLint. |
| `npm test` | Runs all tests once using Vitest. |

## AI Declaration

The preceding document was planned, generated, reviewed and edited with the assistance of ChatGPT-Web[GPT-5.6 Thinking].
