const Task = require('../models/Task');


// CREATE TASK
const createTask = async (req, res) => {
  try {
    const task = await Task.create({
      userId: req.user.id,
      ...req.body,
    });

    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// GET ALL TASKS (USER-SPECIFIC)
const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// UPDATE TASK
const updateTask = async (req, res) => {
  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      req.body,
      { new: true }
    );

    res.json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// DELETE TASK
const deleteTask = async (req, res) => {
  try {
    await Task.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });

    res.json({ message: 'Task deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


module.exports = {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
};