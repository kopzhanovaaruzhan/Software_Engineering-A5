# AGENTS.md

## Purpose

Task Tracker: a small task tracker for a university software engineering
assignment. Users add tasks (title, optional due date, priority low/medium/high),
mark them done or not, delete them, and filter by status and priority. Tasks
persist in localStorage; no backend, login, or database.

## Architecture

- `src/lib/tasks.ts` — business logic only (add, toggle, delete, filter,
  load/save). No React code; pure, unit-testable functions.
- `src/App.tsx` — React components (add form, filter bar, task list); `src/main.tsx` is the entry point.
- `src/lib/tasks.test.ts` — Vitest unit tests for the business logic, run in the jsdom environment from `vitest.config.ts`.
- Stack: React 18, TypeScript, Vite, Tailwind CSS; localStorage only.

## Setup

```bash
npm install
```

## Safe commands

```bash
npm run dev         # start the dev server
npm run test        # run unit tests once
npm run test:watch  # run tests in watch mode
npm run lint        # ESLint
npm run typecheck   # TypeScript check, no emit
npm run build       # typecheck + production build
```

## Commands that need human approval

- Installing, removing, or upgrading any dependency (`npm install <pkg>`,
  `npm uninstall`, `npm update`).
- Changing package.json, tsconfig, vite/vitest, eslint, or Tailwind configs.

## Forbidden actions

- Reading or committing secrets, API keys, or real personal data; all sample
  data must be fictional.
- Production deployment of any kind.
- Destructive commands: `rm -rf`, `git push --force`, `git reset --hard`.
- Unreviewed dependency changes, including `npm audit fix --force`.
- Editing or deleting tests to make them pass; fix the code instead.
- Moving business logic into React components.

## Coding conventions

- Keep business logic in `src/lib/tasks.ts`, not inside React components.
- Logic functions are pure and immutable: they return new arrays, never mutating
  their arguments.
- React components and UI state live in `src/App.tsx` only.
- TypeScript strict mode; every function parameter is explicitly typed.
- Tailwind CSS for styling; lucide-react for icons; `@/` alias for src imports.
- No comments except for non-obvious constraints.

## Test expectations

- 'npm run test' must pass; all existing tests stay green (21 at baseline) in `src/lib/tasks.test.ts`.
- Any behavior change in add, toggle, delete, filter, or load/save must come
  with new or updated tests in the same change.
- localStorage is available to tests (jsdom environment).

## Review gates

A change is complete only after all of these pass without errors:

```bash
npm run lint
npm run typecheck
npm run test
npm run build
```
Do not report a task as done while any of them fails.

A human reviews every diff before commit or merge; the agent reports changed files and exact command results.


