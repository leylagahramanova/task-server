import { Router } from 'express';
import { Task, validateTask } from '../models/task.js';
import authMiddleware from '../middleware/auth.js';

const router = Router();



// Get all tasks for the logged-in user
router.get("/", authMiddleware, async (req, res) => {
    try {
      const tasks = req.user.role === "admin"
        ? await Task.find().populate('userId', 'name email')
        : await Task.find({ userId: req.user._id }).populate('userId', 'name email');
  
      res.status(200).json(tasks);
    } catch (error) {
      res.status(500).json({ msg: error.message });
    }
  });
  
  // Get a task by ID
  router.get("/:id", authMiddleware, async (req, res) => {
    try {
      const task = await Task.findById(req.params.id).populate('userId', 'name email');
      if (!task) return res.status(404).json({ msg: "Data not found" });
  
      if (req.user.role !== "admin" && task.userId._id.toString() !== req.user._id) {
        return res.status(403).json({ msg: "Forbidden access" });
      }
  
      res.status(200).json(task);
    } catch (error) {
      res.status(500).json({ msg: error.message });
    }
  });
  
  // Create a new task
  router.post("/", authMiddleware, async (req, res) => {
    try {
      const { error } = validateTask(req.body);
      if (error) return res.status(400).json({ msg: error.details[0].message });
  
      const newTask = new Task({
        title: req.body.title,
        subtasks: req.body.subtasks,
        userId: req.user._id,
      });
  
      await newTask.save();
      res.status(201).json({ msg: "Task created successfully" });
    } catch (error) {
      res.status(500).json({ msg: error.message });
    }
  });
  
  // Update a task
  router.put("/:id", authMiddleware, async (req, res) => {
    try {
        const { title, subtasks, completed } = req.body;
        const updatedTask = await Task.findByIdAndUpdate(
          req.params.id,
          { title, subtasks, completed },
          { new: true }
        );
      if (!task) return res.status(404).json({ msg: "Data not found" });
  
      if (task.userId.toString() !== req.user._id) {
        return res.status(403).json({ msg: "Forbidden access" });
      }
  
      const { error } = validateTask(req.body, true);
      if (error) return res.status(400).json({ msg: error.details[0].message });
  
 
  
      res.status(200).json({ msg: "Task updated successfully", updatedTask });
    } catch (error) {
      res.status(500).json({ msg: error.message });
    }
  });
  
  // Delete a task
  router.delete("/:id", authMiddleware, async (req, res) => {
    try {
      const task = await Task.findById(req.params.id);
      if (!task) return res.status(404).json({ msg: "Data not found" });
  
      if (req.user.role !== "admin" && task.userId.toString() !== req.user._id) {
        return res.status(403).json({ msg: "Forbidden access" });
      }
  
      await Task.findByIdAndDelete(req.params.id);
      res.status(200).json({ msg: "Task deleted successfully" });
    } catch (error) {
      res.status(500).json({ msg: error.message });
    }
  });
  
  export default router;
  