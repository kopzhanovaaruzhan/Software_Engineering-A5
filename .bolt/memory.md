# Project memory

## Product intent & audience

- University assignment task tracker web app (educational context).
- Features: task management, filtering, local-storage persistence, unit tests.
- Audience: grader/instructor and the student author; production-quality presentation expected per `.bolt/prompt`.

## Brand personality & voice

- No explicit brand voice yet; user communication is terse, procedural, and rule-bound.
- User values precise file-scoped edits and explicit confirmation of what changed vs. what was left untouched.

## Visual design & UX direction

- Stack inferred: Vite + React + TypeScript, Tailwind CSS, Lucide React icons (per `.bolt/prompt`; do not restate global rules).
- Path alias `@/` → `src/` is in use.
- No UI/aesthetic decisions inferred beyond prompt-level guidance; awaiting first design request.

## Decisions, constraints & rationale

- `AGENTS.md` exists and governs agent behavior:
  - "Commands that need human approval" now includes any form of `npm audit fix`, `npm dedupe`, or `npm prune` (added this turn).
  - Existing "Forbidden" ban on `npm audit fix --force` remains untouched.
  - Dependency install/remove/upgrade and config edits (package.json, tsconfig, vite/vitest, eslint, Tailwind) require approval.
- User expects a diff to be shown when a file is edited, even when no git repo is present (before/after or unified diff acceptable).
- No git repo detected in environment; diffs provided manually.

## Open questions & assumptions

- Testing framework assumed Vitest (referenced in AGENTS.md config list); not yet confirmed in code.
- Task data model/schema, filter dimensions, and UI layout not yet specified.
- State-management approach (local state vs. context vs. external store) undecided.
- Whether local-storage persistence is custom or via a wrapper library is unspecified.