import type { Request, Response } from 'express';
import Task from '../models/task.model.js';

// GET all tasks
export const getTasks = async (req: Request, res: Response) => {
  try {
    const { completed, name } = req.query;
    let query: any = {};

    if (completed !== undefined) {
      query.completed = completed === 'true';
    }

    if (name) {
      query.title = { $regex: name as string, $options: 'i' };
    }

    // Relationship Logic: Only fetch tasks that belong to the logged-in user
    const tasks = await Task.find({ user: (req as any).user._id, ...query }).populate('user', '-password'); // Space-separated string for multiple fields
    res.status(200).json({ tasks });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

// CREATE a task
export const createTask = async (req: Request, res: Response) => {
  try {
    // Ownership Logic: Automatically assign the task to the person who is logged in
    const newTask = await Task.create({
      ...req.body,
      user: (req as any).user._id,
    });
    res.status(201).json(newTask);
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};

// UPDATE a task
export const updateTask = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const task = await Task.findById(id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Authorization Check: Make sure the logged-in user owns the task
    if (task.user.toString() !== (req as any).user._id.toString()) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    const updatedTask = await Task.findByIdAndUpdate(id, req.body, { new: true });
    res.status(200).json(updatedTask);
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};

// DELETE a task
export const deleteTask = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const task = await Task.findById(id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Authorization Check: Make sure the logged-in user owns the task
    if (task.user.toString() !== (req as any).user._id.toString()) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    await Task.findByIdAndDelete(id);
    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};

