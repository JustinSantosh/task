import Task from '../models/task.model.js';

export const getTasks = async (req, res, next) => {
  try {
    const {
      status = 'all',
      priority = 'all',
      search = '',
      sortBy = 'createdAt',
      order = 'desc',
    } = req.query;

    const query = {};

    if (status !== 'all') query.status = status;
    if (priority !== 'all') query.priority = priority;
    if (search.trim()) {
      query.$or = [
        { title: { $regex: search.trim(), $options: 'i' } },
        { description: { $regex: search.trim(), $options: 'i' } },
      ];
    }

    const allowedSortFields = ['createdAt', 'dueDate', 'priority', 'title', 'status'];
    const sortField = allowedSortFields.includes(sortBy) ? sortBy : 'createdAt';
    const sortOrder = order === 'asc' ? 1 : -1;

    const tasks = await Task.find(query).sort({ [sortField]: sortOrder });

    res.status(200).json({
      success: true,
      count: tasks.length,
      data: tasks,
    });
  } catch (error) {
    next(error);
  }
};

export const getTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      const error = new Error('Task not found');
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json({ success: true, data: task });
  } catch (error) {
    next(error);
  }
};

export const createTask = async (req, res, next) => {
  try {
    const task = await Task.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Task created successfully',
      data: task,
    });
  } catch (error) {
    next(error);
  }
};

export const updateTask = async (req, res, next) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!task) {
      const error = new Error('Task not found');
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json({
      success: true,
      message: 'Task updated successfully',
      data: task,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);

    if (!task) {
      const error = new Error('Task not found');
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json({
      success: true,
      message: 'Task deleted successfully',
      data: task,
    });
  } catch (error) {
    next(error);
  }
};

