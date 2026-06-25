const Task = require('../models/Task');

const getTasks = async (req, res, next) => {
  try {
    const filter = { user: req.user._id };

    if (req.query.status && req.query.status !== 'All') {
      filter.status = req.query.status;
    }

    if (req.query.priority && req.query.priority !== 'All') {
      filter.priority = req.query.priority;
    }

    if (req.query.search) {
      filter.title = { $regex: req.query.search, $options: 'i' };
    }

    const sortField = req.query.sortBy === 'dueDate' ? 'dueDate' : 'createdAt';
    const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;

    const tasks = await Task.find(filter).sort({ [sortField]: sortOrder });

    res.json({
      success: true,
      count: tasks.length,
      data: tasks,
    });
  } catch (error) {
    next(error);
  }
};

const createTask = async (req, res, next) => {
  try {
    const { title, description, status, priority, dueDate } = req.body;

    if (!title || !title.trim()) {
      const error = new Error('Title is required');
      error.statusCode = 400;
      throw error;
    }

    const task = await Task.create({
      title: title.trim(),
      description: description?.trim() || '',
      status: status || 'Pending',
      priority: priority || 'Medium',
      dueDate: dueDate || null,
      user: req.user._id,
    });

    res.status(201).json({
      success: true,
      data: task,
    });
  } catch (error) {
    next(error);
  }
};

const updateTask = async (req, res, next) => {
  try {
    let task = await Task.findById(req.params.id);

    if (!task) {
      const error = new Error('Task not found');
      error.statusCode = 404;
      throw error;
    }

    if (task.user.toString() !== req.user._id.toString()) {
      const error = new Error('Not authorized to update this task');
      error.statusCode = 403;
      throw error;
    }

    const { title, description, status, priority, dueDate } = req.body;

    if (title !== undefined) task.title = title.trim();
    if (description !== undefined) task.description = description.trim();
    if (status !== undefined) task.status = status;
    if (priority !== undefined) task.priority = priority;
    if (dueDate !== undefined) task.dueDate = dueDate || null;

    task = await task.save();

    res.json({
      success: true,
      data: task,
    });
  } catch (error) {
    next(error);
  }
};

const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      const error = new Error('Task not found');
      error.statusCode = 404;
      throw error;
    }

    if (task.user.toString() !== req.user._id.toString()) {
      const error = new Error('Not authorized to delete this task');
      error.statusCode = 403;
      throw error;
    }

    await task.deleteOne();

    res.json({
      success: true,
      message: 'Task deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

const clearCompleted = async (req, res, next) => {
  try {
    const result = await Task.deleteMany({
      user: req.user._id,
      status: 'Completed',
    });

    res.json({
      success: true,
      message: `${result.deletedCount} completed task(s) removed`,
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getTasks, createTask, updateTask, deleteTask, clearCompleted };
