import {
  formatDate,
  formatRelativeDate,
  isOverdue,
  STATUS_OPTIONS,
} from '../utils/taskHelpers';

function TaskRow({ task, onEdit, onDelete, onToggleComplete, onStatusChange }) {
  const completed = task.status === 'Completed';
  const overdue = isOverdue(task);

  return (
    <div
      className={`group flex items-start gap-3 px-3 py-2.5 border-b border-zinc-100 dark:border-zinc-800/80 last:border-b-0 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors ${
        completed ? 'opacity-60' : ''
      }`}
    >
      <button
        onClick={() => onToggleComplete(task)}
        aria-label={completed ? 'Mark incomplete' : 'Mark complete'}
        className={`mt-0.5 shrink-0 w-4 h-4 rounded border flex items-center justify-center transition-colors ${
          completed
            ? 'bg-zinc-900 dark:bg-zinc-100 border-zinc-900 dark:border-zinc-100'
            : 'border-zinc-300 dark:border-zinc-600 hover:border-zinc-500 dark:hover:border-zinc-400'
        }`}
      >
        {completed && (
          <svg className="w-2.5 h-2.5 text-white dark:text-zinc-900" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        )}
      </button>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <button
            onClick={() => onEdit(task)}
            className={`text-left text-sm font-medium truncate ${
              completed
                ? 'line-through text-zinc-400 dark:text-zinc-500'
                : 'text-zinc-900 dark:text-zinc-100 hover:text-zinc-600 dark:hover:text-zinc-300'
            }`}
          >
            {task.title}
          </button>

          <div className="flex items-center gap-1.5 shrink-0 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
            <button
              onClick={() => onEdit(task)}
              className="p-1 rounded text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-200/60 dark:hover:bg-zinc-800"
              aria-label="Edit task"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            <button
              onClick={() => onDelete(task)}
              className="p-1 rounded text-zinc-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30"
              aria-label="Delete task"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>

        {task.description && (
          <p className="text-xs text-zinc-500 dark:text-zinc-500 mt-0.5 line-clamp-1">
            {task.description}
          </p>
        )}

        <div className="flex flex-wrap items-center gap-2 mt-1.5">
          <select
            value={task.status}
            onChange={(e) => onStatusChange(task, e.target.value)}
            className="text-[11px] px-1.5 py-0.5 rounded border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 cursor-pointer"
          >
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>

          {task.priority && task.priority !== 'Medium' && (
            <span className="text-[10px] uppercase tracking-wide text-zinc-400 dark:text-zinc-500">
              {task.priority}
            </span>
          )}

          {task.dueDate && (
            <span
              className={`text-[11px] ${
                overdue
                  ? 'text-red-600 dark:text-red-400 font-medium'
                  : 'text-zinc-400 dark:text-zinc-500'
              }`}
            >
              {overdue ? formatRelativeDate(task.dueDate) : formatRelativeDate(task.dueDate)}
            </span>
          )}

          <span className="text-[11px] text-zinc-300 dark:text-zinc-600">
            {formatDate(task.createdAt)}
          </span>
        </div>
      </div>
    </div>
  );
}

export default TaskRow;
