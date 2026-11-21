import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  addTask,
  toggleTask,
  deleteTask,
  filterTasks,
  loadTasks,
  saveTasks,
  type Task,
} from './tasks';

const baseTask: Task = {
  id: 't1',
  title: 'Write report',
  dueDate: null,
  priority: 'medium',
  done: false,
};

const doneTask: Task = {
  id: 't2',
  title: 'Read chapter 3',
  dueDate: null,
  priority: 'low',
  done: true,
};

const sampleTasks = [baseTask, doneTask];

beforeEach(() => {
  localStorage.clear();
});

describe('addTask', () => {
  it('adds a task with the given title', () => {
    const result = addTask([], { title: 'Buy groceries' });
    expect(result).not.toBeNull();
    expect(result![0].title).toBe('Buy groceries');
  });

  it('trims surrounding whitespace from the title', () => {
    const result = addTask([], { title: '  Buy groceries  ' });
    expect(result![0].title).toBe('Buy groceries');
  });

  it('rejects an empty title by returning null', () => {
    expect(addTask([], { title: '' })).toBeNull();
  });

  it('rejects a whitespace-only title by returning null', () => {
    expect(addTask([], { title: '   ' })).toBeNull();
  });

  it('defaults priority to low and dueDate to null', () => {
    const result = addTask([], { title: 'New task' });
    expect(result![0].priority).toBe('low');
    expect(result![0].dueDate).toBeNull();
  });

  it('keeps existing tasks and appends the new one', () => {
    const result = addTask(sampleTasks, { title: 'Another task' });
    expect(result).toHaveLength(3);
    expect(result![2].title).toBe('Another task');
  });

  it('does not mutate the original array', () => {
    const copy = [...sampleTasks];
    addTask(sampleTasks, { title: 'Another task' });
    expect(sampleTasks).toEqual(copy);
  });
});

describe('toggleTask', () => {
  it('marks an active task as done', () => {
    const result = toggleTask(sampleTasks, 't1');
    expect(result.find((t) => t.id === 't1')!.done).toBe(true);
  });

  it('marks a done task back to active', () => {
    const result = toggleTask(sampleTasks, 't2');
    expect(result.find((t) => t.id === 't2')!.done).toBe(false);
  });

  it('leaves other tasks untouched', () => {
    const result = toggleTask(sampleTasks, 't1');
    expect(result.find((t) => t.id === 't2')!.done).toBe(true);
  });
});

describe('deleteTask', () => {
  it('removes the task with the given id', () => {
    const result = deleteTask(sampleTasks, 't1');
    expect(result).toHaveLength(1);
    expect(result.some((t) => t.id === 't1')).toBe(false);
  });

  it('returns the list unchanged when the id does not exist', () => {
    expect(deleteTask(sampleTasks, 'nope')).toHaveLength(2);
  });
});

describe('filterTasks', () => {
  it('returns everything for the all/all filter', () => {
    expect(filterTasks(sampleTasks, { status: 'all', priority: 'all' })).toHaveLength(2);
  });

  it('returns only active tasks for status active', () => {
    const result = filterTasks(sampleTasks, { status: 'active', priority: 'all' });
    expect(result).toEqual([baseTask]);
  });

  it('returns only done tasks for status done', () => {
    const result = filterTasks(sampleTasks, { status: 'done', priority: 'all' });
    expect(result).toEqual([doneTask]);
  });

  it('filters by priority', () => {
    const result = filterTasks(sampleTasks, { status: 'all', priority: 'medium' });
    expect(result).toEqual([baseTask]);
  });

  it('combines status and priority filters', () => {
    const result = filterTasks(sampleTasks, { status: 'done', priority: 'medium' });
    expect(result).toEqual([]);
  });
});

describe('saveTasks and loadTasks', () => {
  it('round-trips tasks through localStorage', () => {
    saveTasks(sampleTasks);
    expect(loadTasks()).toEqual(sampleTasks);
  });

  it('returns an empty array when nothing is saved', () => {
    expect(loadTasks()).toEqual([]);
  });

  it('returns an empty array for invalid JSON', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockReturnValueOnce('{not json');
    expect(loadTasks()).toEqual([]);
  });

  it('drops entries that are not valid tasks', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockReturnValueOnce(
      JSON.stringify([baseTask, { id: 'x' }])
    );
    expect(loadTasks()).toEqual([baseTask]);
  });
});
