# COMS3011A Lab 1 — Local Task Manager

A local-first todo application built with Next.js and SQLite.

The application runs locally for a single user. It does not require user accounts or deployment.

## Features

- Create tasks with a title, description, due date, topic and status.
- Edit active tasks.
- Archive tasks without deleting them.
- View active and archived tasks separately.
- Sort tasks by topic, status or due date.
- Use the fixed statuses `Todo`, `In-Progress` and `Complete`.
- Visually identify overdue incomplete tasks.
- Persist task information after the application is restarted.

## Quick Start

### Requirements

This project was developed and tested using:

- Node.js `v24.13.1`
- npm `11.8.0`

### Install

From the repository directory:

~~~bash
npm ci
~~~

### Run in Development

~~~bash
npm run dev
~~~

Open:

~~~text
http://localhost:3000
~~~

The SQLite database is created automatically when the application first runs.

### Run Tests

~~~bash
npm test
~~~

### Run a Production Build

~~~bash
npm run build
npm start
~~~

Open:

~~~text
http://localhost:3000
~~~

## Documentation

- [Project documentation](docs/documentation.md)
- [AI usage records](ai/README.md)

## AI Usage

This repository makes use of AI code generation using the following tools: ChatGPT-Web[GPT-5.6 Thinking].

This repository does not use AI in-line editing tools.

This repository makes use of AI code-review using the following tools: ChatGPT-Web[GPT-5.6 Thinking].

## AI Declaration

The preceding document was planned, generated, reviewed and edited with the assistance of ChatGPT-Web[GPT-5.6 Thinking].
