import { useState, useEffect } from 'react';
import {
  STATUS_OPTIONS,
  PRIORITY_OPTIONS,
  toInputDate,
} from '../utils/taskHelpers';

const emptyForm = {
  title: '',
  description: '',
  status: 'Pending',
  priority: 'Medium',
  dueDate: '',
};

const getInitialForm = (initialData) =>
  initialData
    ? {
        title: initialData.title,
        description: initialData.description || '',
        status: initialData.status,
        priority: initialData.priority || 'Medium',
        dueDate: toInputDate(initialData.dueDate),
      }
    : emptyForm;

const inputClass =
  'w-full px-2.5 py-2 text-sm rounded-md border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-400 dark:focus:ring-zinc-500';

function PillGroup({ options, value, onChange, name }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {options.map((option) => (
        <button
          key={option}
          type="button"
          onClick={() => onChange({ target: { name, value: option } })}
          className={`px-2.5 py-1 text-xs rounded-md border transition-colors ${
            value === option
              ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 border-zinc-900 dark:border-zinc-100'
              : 'border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:border-zinc-400 dark:hover:border-zinc-500'
          }`}
        >
          {option}
        </button>
      ))}
    </div>
  );
}

function TaskForm({ isOpen, onClose, onSubmit, initialData, isEditing }) {
  const [form, setForm] = useState(() => getInitialForm(initialData));
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validate = () => {
    const next = {};
    if (!form.title.trim()) next.title = 'Title is required';
    if (form.title.length > 120) next.title = 'Max 120 characters';
    if (form.description.length > 500) next.description = 'Max 500 characters';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      await onSubmit({
        ...form,
        dueDate: form.dueDate ? new Date(form.dueDate).toISOString() : null,
      });
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div
        className="absolute inset-0 bg-zinc-900/30 dark:bg-black/50 animate-fade-in"
        onClick={onClose}
      />
      <div className="relative w-full max-w-md h-full sm:h-auto sm:max-h-[100dvh] sm:m-4 sm:rounded-lg bg-white dark:bg-zinc-950 border-l sm:border border-zinc-200 dark:border-zinc-800 shadow-xl flex flex-col animate-slide-in">
        <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-100 dark:border-zinc-800">
          <div>
            <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              {isEditing ? 'Edit task' : 'New task'}
            </h2>
            <p className="text-xs text-zinc-500 mt-0.5">
              {isEditing ? 'Update details below' : 'Add a task to your list'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-md text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
            aria-label="Close"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <div>
            <div className="flex items-center justify-between mb-1">
              <label htmlFor="title" className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
                Title
              </label>
              <span className="text-[10px] text-zinc-400 tabular-nums">
                {form.title.length}/120
              </span>
            </div>
            <input
              id="title"
              name="title"
              type="text"
              value={form.title}
              onChange={handleChange}
              autoFocus
              placeholder="What needs to be done?"
              className={`${inputClass} ${errors.title ? 'border-red-400' : ''}`}
            />
            {errors.title && (
              <p className="text-[11px] text-red-500 mt-1">{errors.title}</p>
            )}
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label htmlFor="description" className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
                Notes
              </label>
              <span className="text-[10px] text-zinc-400 tabular-nums">
                {form.description.length}/500
              </span>
            </div>
            <textarea
              id="description"
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={3}
              placeholder="Optional details..."
              className={`${inputClass} resize-none ${errors.description ? 'border-red-400' : ''}`}
            />
            {errors.description && (
              <p className="text-[11px] text-red-500 mt-1">{errors.description}</p>
            )}
          </div>

          <div>
            <label className="text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1.5 block">
              Status
            </label>
            <PillGroup
              options={STATUS_OPTIONS}
              value={form.status}
              onChange={handleChange}
              name="status"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1.5 block">
              Priority
            </label>
            <PillGroup
              options={PRIORITY_OPTIONS}
              value={form.priority}
              onChange={handleChange}
              name="priority"
            />
          </div>

          <div>
            <label htmlFor="dueDate" className="text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1 block">
              Due date
            </label>
            <input
              id="dueDate"
              name="dueDate"
              type="date"
              value={form.dueDate}
              onChange={handleChange}
              className={inputClass}
            />
          </div>
          </div>

          <div className="flex gap-2 p-4 border-t border-zinc-100 dark:border-zinc-800">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-3 py-2 text-xs font-medium rounded-md border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 px-3 py-2 text-xs font-medium rounded-md bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200 disabled:opacity-50 transition-colors"
            >
              {submitting ? 'Saving...' : isEditing ? 'Save changes' : 'Create task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default TaskForm;
