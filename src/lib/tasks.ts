export type Priority = 'low' | 'medium' | 'high';

export type Task = {
  id: string;
  title: string;
  dueDate: string | null;
  priority: Priority;
  done: boolean;
};

export type StatusFilter = 'all' | 'active' | 'done';

export type Filters = {
  status: StatusFilter;
  priority: Priority | 'all';
};

export type NewTaskInput = {
  title: string;
  dueDate?: string | null;
  priority?: Priority;
};

let nextId = 1;

export function makeId(): string {
  return `task-${Date.now()}-${nextId++}`;
}

/** Returns null for empty or whitespace-only titles. */
export function addTask(tasks: Task[], input: NewTaskInput): Task[] | null {
  const title = input.title.trim();
  if (title === '') return null;
  const task: Task = {
    id: makeId(),
    title,
    dueDate: input.dueDate ?? null,
    priority: input.priority ?? 'low',
    done: false,
  };
  return [...tasks, task];
}

export function toggleTask(tasks: Task[], id: string): Task[] {
  return tasks.map((task) =>
    task.id === id ? { ...task, done: !task.done } : task
  );
}

export function deleteTask(tasks: Task[], id: string): Task[] {
  return tasks.filter((task) => task.id !== id);
}

export function filterTasks(tasks: Task[], filters: Filters): Task[] {
  return tasks.filter((task) => {
    if (filters.status === 'active' && task.done) return false;
    if (filters.status === 'done' && !task.done) return false;
    if (filters.priority !== 'all' && task.priority !== filters.priority)
      return false;
    return true;
  });
}

const STORAGE_KEY = 'task-tracker.tasks';

export function saveTasks(tasks: Task[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

export function loadTasks(): Task[] {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw === null) return [];
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isTask);
  } catch {
    return [];
  }
}

function isTask(value: unknown): value is Task {
  if (typeof value !== 'object' || value === null) return false;
  const t = value as Record<string, unknown>;
  return (
    typeof t.id === 'string' &&
    typeof t.title === 'string' &&
    (t.dueDate === null || typeof t.dueDate === 'string') &&
    (t.priority === 'low' || t.priority === 'medium' || t.priority === 'high') &&
    typeof t.done === 'boolean'
  );
}
