import { useState } from 'react';
import { Plus, Trash2, RotateCcw, CheckCircle2, Circle, ListFilter } from 'lucide-react';
import {
  addTask,
  deleteTask,
  filterTasks,
  loadTasks,
  saveTasks,
  toggleTask,
  type Filters,
  type NewTaskInput,
  type Priority,
  type StatusFilter,
  type Task,
} from '@/lib/tasks';

const priorityStyles: Record<Priority, string> = {
  low: 'bg-emerald-100 text-emerald-700 ring-emerald-200',
  medium: 'bg-amber-100 text-amber-700 ring-amber-200',
  high: 'bg-rose-100 text-rose-700 ring-rose-200',
};

function formatDate(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  return date.toLocaleDateString(undefined, {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

type AddFormProps = { onAdd: (input: NewTaskInput) => boolean };

function AddForm({ onAdd }: AddFormProps) {
  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState<Priority>('low');
  const [error, setError] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const ok = onAdd({ title, dueDate: dueDate || null, priority });
    if (ok) {
      setTitle('');
      setDueDate('');
      setPriority('low');
      setError('');
    } else {
      setError('Please enter a task title.');
    }
  }

  const inputClasses =
    'w-full min-w-0 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-200 transition';

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-[minmax(0,1fr)_auto_auto_auto]">
        <input
          type="text"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            if (error) setError('');
          }}
          placeholder="What needs to be done?"
          aria-label="Task title"
          className={`${inputClasses} col-span-2 sm:col-span-1`}
        />
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          aria-label="Due date"
          className={inputClasses}
        />
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value as Priority)}
          aria-label="Priority"
          className={inputClasses}
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        <button
          type="submit"
          className="col-span-2 inline-flex items-center justify-center gap-2 rounded-lg bg-sky-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-300 active:scale-95 sm:col-span-1"
        >
          <Plus className="h-4 w-4" />
          Add
        </button>
      </div>
      {error && <p className="text-sm text-rose-600">{error}</p>}
    </form>
  );
}

type FilterBarProps = {
  filters: Filters;
  onStatusChange: (status: StatusFilter) => void;
  onPriorityChange: (priority: Filters['priority']) => void;
};

function FilterBar({ filters, onStatusChange, onPriorityChange }: FilterBarProps) {
  const statusOptions: { value: StatusFilter; label: string }[] = [
    { value: 'all', label: 'All' },
    { value: 'active', label: 'Active' },
    { value: 'done', label: 'Done' },
  ];

  const statusClasses = (active: boolean) =>
    `rounded-lg px-3 py-1.5 text-sm font-medium transition ${
      active
        ? 'bg-slate-900 text-white shadow-sm'
        : 'text-slate-600 hover:bg-slate-200'
    }`;

  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="flex items-center gap-1 rounded-xl bg-slate-100 p-1">
        {statusOptions.map(({ value, label }) => (
          <button
            key={value}
            type="button"
            onClick={() => onStatusChange(value)}
            className={statusClasses(filters.status === value)}
          >
            {label}
          </button>
        ))}
      </div>
      <div className="flex items-center gap-2 text-sm text-slate-600">
        <ListFilter className="h-4 w-4" />
        <select
          value={filters.priority}
          onChange={(e) =>
            onPriorityChange(e.target.value as Filters['priority'])
          }
          aria-label="Filter by priority"
          className="rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-sm text-slate-900 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-200"
        >
          <option value="all">All priorities</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>
    </div>
  );
}

type TaskRowProps = {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
};

function TaskRow({ task, onToggle, onDelete }: TaskRowProps) {
  return (
    <li
      className={`group flex items-center gap-3 rounded-xl border px-4 py-3 transition ${
        task.done
          ? 'border-slate-100 bg-slate-50'
          : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm'
      }`}
    >
      <button
        type="button"
        onClick={() => onToggle(task.id)}
        aria-label={task.done ? 'Mark as not done' : 'Mark as done'}
        className="shrink-0 text-slate-400 transition hover:scale-110 hover:text-sky-600 focus:outline-none focus:ring-2 focus:ring-sky-300 rounded-full"
      >
        {task.done ? (
          <CheckCircle2 className="h-5 w-5 text-emerald-500" />
        ) : (
          <Circle className="h-5 w-5" />
        )}
      </button>
      <div className="min-w-0 flex-1">
        <p
          className={`truncate text-sm font-medium transition ${
            task.done ? 'text-slate-400 line-through' : 'text-slate-900'
          }`}
        >
          {task.title}
        </p>
        <div className="mt-1 flex flex-wrap items-center gap-2">
          <span
            className={`rounded-full px-2 py-0.5 text-xs font-medium capitalize ring-1 ring-inset ${
              priorityStyles[task.priority]
            }`}
          >
            {task.priority}
          </span>
          {task.dueDate && (
            <span className="text-xs text-slate-500">
              Due {formatDate(task.dueDate)}
            </span>
          )}
        </div>
      </div>
      <button
        type="button"
        onClick={() => onDelete(task.id)}
        aria-label={`Delete task: ${task.title}`}
        className="shrink-0 rounded-lg p-2 text-slate-400 transition hover:bg-rose-50 hover:text-rose-600 focus:outline-none focus:ring-2 focus:ring-rose-200"
      >
        {task.done ? (
          <RotateCcw className="h-4 w-4" />
        ) : (
          <Trash2 className="h-4 w-4" />
        )}
      </button>
    </li>
  );
}

type AppProps = { initialTasks?: Task[] };

export function App({ initialTasks }: AppProps) {
  const [tasks, setTasks] = useState<Task[]>(() =>
    initialTasks ? initialTasks : loadTasks()
  );
  const [filters, setFilters] = useState<Filters>({
    status: 'all',
    priority: 'all',
  });

  function update(next: Task[]) {
    setTasks(next);
    saveTasks(next);
  }

  function handleAdd(input: NewTaskInput): boolean {
    const next = addTask(tasks, input);
    if (!next) return false;
    update(next);
    return true;
  }

  const visibleTasks = filterTasks(tasks, filters);
  const activeCount = tasks.filter((t) => !t.done).length;

  return (
    <div className="min-h-screen bg-slate-100 py-10">
      <main className="mx-auto w-full max-w-xl px-4">
        <header className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Task Tracker
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            {tasks.length === 0
              ? 'No tasks yet. Add your first one below.'
              : `${activeCount} of ${tasks.length} task${
                  tasks.length === 1 ? '' : 's'
                } remaining.`}
          </p>
        </header>

        <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
          <AddForm onAdd={handleAdd} />
        </section>

        <section className="mt-6 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
          <div className="mb-4">
            <FilterBar
              filters={filters}
              onStatusChange={(status) =>
                setFilters((f) => ({ ...f, status }))
              }
              onPriorityChange={(priority) =>
                setFilters((f) => ({ ...f, priority }))
              }
            />
          </div>
          {visibleTasks.length === 0 ? (
            <p className="rounded-xl border border-dashed border-slate-300 bg-white/60 px-4 py-8 text-center text-sm text-slate-500">
              No tasks match the current filters.
            </p>
          ) : (
            <ul className="space-y-2">
              {visibleTasks.map((task) => (
                <TaskRow
                  key={task.id}
                  task={task}
                  onToggle={(id) => update(toggleTask(tasks, id))}
                  onDelete={(id) => update(deleteTask(tasks, id))}
                />
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;
