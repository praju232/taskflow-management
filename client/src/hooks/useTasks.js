import { useState, useEffect, useCallback, useMemo } from 'react';
import { taskAPI } from '../services/api';
import { sortTasks } from '../utils/taskHelpers';

export const useTasks = () => {
  const [allTasks, setAllTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const fetchTasks = useCallback(async (silent = false) => {
    if (silent) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    setError(null);
    try {
      const { data } = await taskAPI.getAll();
      setAllTasks(data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch tasks');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- fetch tasks on mount
    fetchTasks();
  }, [fetchTasks]);

  const filterAndSortTasks = useCallback(
    (statusFilter, priorityFilter, searchQuery, sortBy) => {
      let filtered = allTasks;

      if (statusFilter && statusFilter !== 'All') {
        filtered = filtered.filter((task) => task.status === statusFilter);
      }

      if (priorityFilter && priorityFilter !== 'All') {
        filtered = filtered.filter((task) => task.priority === priorityFilter);
      }

      if (searchQuery.trim()) {
        const query = searchQuery.trim().toLowerCase();
        filtered = filtered.filter(
          (task) =>
            task.title.toLowerCase().includes(query) ||
            task.description?.toLowerCase().includes(query)
        );
      }

      return sortTasks(filtered, sortBy);
    },
    [allTasks]
  );

  const stats = useMemo(
    () => ({
      total: allTasks.length,
      pending: allTasks.filter((t) => t.status === 'Pending').length,
      inProgress: allTasks.filter((t) => t.status === 'In Progress').length,
      completed: allTasks.filter((t) => t.status === 'Completed').length,
    }),
    [allTasks]
  );

  const createTask = async (taskData) => {
    const { data } = await taskAPI.create(taskData);
    setAllTasks((prev) => [data.data, ...prev]);
    return data.data;
  };

  const updateTask = async (id, taskData) => {
    const { data } = await taskAPI.update(id, taskData);
    setAllTasks((prev) =>
      prev.map((task) => (task._id === id ? data.data : task))
    );
    return data.data;
  };

  const deleteTask = async (id) => {
    await taskAPI.delete(id);
    setAllTasks((prev) => prev.filter((task) => task._id !== id));
  };

  const clearCompleted = async () => {
    const { data } = await taskAPI.clearCompleted();
    setAllTasks((prev) => prev.filter((task) => task.status !== 'Completed'));
    return data;
  };

  const toggleComplete = async (task) => {
    const newStatus = task.status === 'Completed' ? 'Pending' : 'Completed';
    return updateTask(task._id, { status: newStatus });
  };

  return {
    allTasks,
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
  };
};
