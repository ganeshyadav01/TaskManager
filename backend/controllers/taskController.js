
const Task = require("../models/TaskModel");
const User = require("../models/UserAuthModel");

// Fetch all tasks
exports.getTasks = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (!user.email) return res.status(401).json({ message: "Unauthorized" });
    console.log("Extracted Email:", user.email); // Debugging log

    const tasks = await Task.find({ userId: user.id });
    console.log("tasks", tasks)
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// Add a new task
exports.createTask = async (req, res) => {
  try {    
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (!user.email) return res.status(401).json({ message: "Unauthorized" });
    console.log("Extracted Email:", user.email); // Debugging log

    const { name, description, dueDate, status, priority } = req.body;
    const newTask = new Task({ name, description, dueDate, status, priority, userId: user.id }); // Assign user ID
    console.log("newTask", newTask)

    await newTask.save();
    res.status(201).json({ message: "New task successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Fetch a task
exports.getTask = async (req, res) => {
    try {
      const task = await Task.findById(req.params.id, req.body, { new: true });
      res.json(task);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
};

// Update a task
exports.updateTask = async (req, res) => {
  try {
    await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({message: "Task updated successfully"});
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete a task
exports.deleteTask = async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: "Task deleted successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
