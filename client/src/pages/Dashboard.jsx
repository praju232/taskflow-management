import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import { useTasks } from '../hooks/useTasks';
import StatsBar from '../components/StatsBar';
import TaskRow from '../components/TaskRow';
import TaskForm from '../components/TaskForm';
import TaskToolbar from '../components/TaskToolbar';
import ConfirmDialog from '../components/ConfirmDialog';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';

function Dashboard() {
  const { user } = useAuth();
  const { addToast } = useToast();
  const [statusFilter, setStatusFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [formOpen, setFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [clearConfirm, setClearConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [clearing, setClearing] = useState(false);

  const {
    loading,
    refreshing,
    error,
    stats,
    filterAndSortTasks,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
    clearCompleted,
    toggleComplete,
  } = useTasks();

  const tasks = filterAndSortTasks(
    statusFilter,
    priorityFilter,
    debouncedSearch,
    sortBy
  );

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    clearTimeout(window.searchTimeout);
    window.searchTimeout = setTimeout(() => setDebouncedSearch(value), 300);
  };

  const handleCreate = () => {
    setEditingTask(null);
    setFormOpen(true);
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    setFormOpen(true);
  };

  const handleFormSubmit = async (formData) => {
    try {
      if (editingTask) {
        await updateTask(editingTask._id, formData);
        addToast('Task updated', 'success');
      } else {
        await createTask(formData);
         setEditingTask(null);
         console.log('Task created', editingTask);
        addToast('Task created', 'success');
      }
    } catch (err) {
      addToast(err.response?.data?.message || 'Something went wrong', 'error');
      throw err;
    }
  };

  const handleToggleComplete = async (task) => {
    try {
      await toggleComplete(task);
      addToast(
        task.status === 'Completed' ? 'Task reopened' : 'Task completed',
        'success'
      );
    } catch (err) {
      addToast(err.response?.data?.message || 'Update failed', 'error');
    }
  };

  const handleStatusChange = async (task, status) => {
    try {
      await updateTask(task._id, { status });
      addToast('Status updated', 'success');
    } catch (err) {
      addToast(err.response?.data?.message || 'Update failed', 'error');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteTask(deleteTarget._id);
      addToast('Task deleted', 'success');
      setDeleteTarget(null);
    } catch (err) {
      addToast(err.response?.data?.message || 'Delete failed', 'error');
    } finally {
      setDeleting(false);
    }
  };

  const handleClearCompleted = async () => {
    setClearing(true);
    try {
      const result = await clearCompleted();
      addToast(result.message || 'Completed tasks cleared', 'success');
      setClearConfirm(false);
    } catch (err) {
      addToast(err.response?.data?.message || 'Clear failed', 'error');
    } finally {
      setClearing(false);
    }
  };

  const hasFilters =
    debouncedSearch || statusFilter !== 'All' || priorityFilter !== 'All';

  return (
    <div className="mx-auto px-4 py-5 sm:py-6">
      <header className="mb-5">
        <p className="text-xs text-zinc-500 dark:text-zinc-500 mb-0.5">
          {new Date().toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
          })}
        </p>
        <h1 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
          Tasks
        </h1>
        <p className="text-xs text-zinc-500 dark:text-zinc-500 mt-0.5">
          {user?.name}
        </p>
      </header>

      <div className="space-y-3 mb-4">
        <StatsBar
          stats={stats}
          activeFilter={statusFilter}
          onFilterChange={setStatusFilter}
        />
        <TaskToolbar
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
          priorityFilter={priorityFilter}
          onPriorityChange={setPriorityFilter}
          sortBy={sortBy}
          onSortChange={setSortBy}
          onRefresh={() => fetchTasks(true)}
          onClearCompleted={() => setClearConfirm(true)}
          onCreate={handleCreate}
          refreshing={refreshing}
          completedCount={stats.completed}
        />
      </div>

      <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 overflow-hidden">
        {loading ? (
          <div className="py-16">
            <LoadingSpinner size="md" className="mx-auto" />
          </div>
        ) : error ? (
          <div className="py-12 text-center">
            <p className="text-sm text-red-600 dark:text-red-400 mb-3">{error}</p>
            <button
              onClick={() => fetchTasks()}
              className="text-xs text-zinc-600 dark:text-zinc-400 underline"
            >
              Try again
            </button>
          </div>
        ) : tasks.length === 0 ? (
          <EmptyState
            message={
              hasFilters
                ? 'No tasks match your filters.'
                : 'Your task list is empty. Add one to get started.'
            }
            actionLabel={!hasFilters ? 'Add task' : undefined}
            onAction={!hasFilters ? handleCreate : undefined}
          />
        ) : (
          <>
            <div className="px-3 py-2 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
              <span className="text-[11px] text-zinc-400 uppercase tracking-wide">
                {tasks.length} task{tasks.length !== 1 ? 's' : ''}
              </span>
            </div>
            {tasks.map((task) => (
              <TaskRow
                key={task._id}
                task={task}
                onEdit={handleEdit}
                onDelete={setDeleteTarget}
                onToggleComplete={handleToggleComplete}
                onStatusChange={handleStatusChange}
              />
            ))}
          </>
        )}
      </div>

      <TaskForm
        key={editingTask?._id ?? 'new'}
        isOpen={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={editingTask}
        isEditing={!!editingTask}
      />

      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="Delete task"
        message={`Delete "${deleteTarget?.title}"? This cannot be undone.`}
        confirmLabel="Delete"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
        loading={deleting}
        variant="danger"
      />

      <ConfirmDialog
        isOpen={clearConfirm}
        title="Clear completed"
        message={`Remove all ${stats.completed} completed task(s) from your list?`}
        confirmLabel="Clear all"
        onConfirm={handleClearCompleted}
        onCancel={() => setClearConfirm(false)}
        loading={clearing}
        variant="danger"
      />
    </div>
  );
}

export default Dashboard;
