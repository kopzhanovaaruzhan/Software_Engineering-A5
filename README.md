# Task Tracker

A small task tracker built with React, TypeScript and Vite for a university
software engineering assignment.

Features:

- Add a task with a title, an optional due date, and a priority
  (low / medium / high)
- Mark a task as done or not done
- Delete a task
- Filter the list by status (all / active / done) and by priority
- Tasks are persisted in the browser via `localStorage`

## Setup

```bash
npm install
```

## Run

```bash
npm run dev
```

Then open the local URL shown in the terminal (usually
http://localhost:5173).

## Test

```bash
npm test
```

Runs the Vitest unit tests for the business logic
(`src/lib/tasks.test.ts`).

## Other commands

```bash
npm run lint        # ESLint
npm run typecheck   # TypeScript, no emit
npm run build       # production build (runs typecheck first)
npm run preview     # serve the production build locally
```

## Project structure

- `src/lib/tasks.ts` — business logic (add, toggle, delete, filter,
  load/save). No React code in here, so it can be unit tested on its own.
- `src/App.tsx` — React components (form, filter bar, task list).
- `src/lib/tasks.test.ts` — Vitest unit tests for the business logic.

All sample data is fictional. The app stores data only in your browser's
`localStorage`; there is no backend, login or database.
