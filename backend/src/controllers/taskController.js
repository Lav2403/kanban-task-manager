const Task = require("../models/Task");

// ✅ Create Task
async function createTask(req, res) {
  try {
    const { title, description, due_date } = req.body;

    if (!title || !due_date) {
      return res.status(400).json({ message: "Title and due date are required." });
    }

    // ✅ better validation
    if (String(title).trim().length < 3) {
      return res.status(400).json({ message: "Title must be at least 3 characters." });
    }

    const due = new Date(due_date);
    if (isNaN(due.getTime())) {
      return res.status(400).json({ message: "Invalid due date format." });
    }

    const task = await Task.create({
      userId: req.user._id,
      title: String(title).trim(),
      description: String(description || "").trim(),
      due_date: due,
      status: "pending"
    });

    return res.status(201).json(task);
  } catch (err) {
    return res.status(500).json({ message: "Task creation failed.", error: err.message });
  }
}

// ✅ Get all tasks of logged-in user (✅ supports filtering by status)
async function getMyTasks(req, res) {
  try {
    const { status } = req.query;

    const filter = { userId: req.user._id };

    // ✅ Filter by status: /api/v1/tasks?status=pending
    if (status) {
      const allowed = ["pending", "in-progress", "completed"];

      if (!allowed.includes(status)) {
        return res.status(400).json({
          message: "Invalid status filter. Use pending | in-progress | completed"
        });
      }

      filter.status = status;
    }

    const tasks = await Task.find(filter).sort({ createdAt: -1 });
    return res.status(200).json(tasks);
  } catch (err) {
    return res.status(500).json({ message: "Failed to fetch tasks.", error: err.message });
  }
}

// ✅ Update task details (Edit modal)
async function updateTask(req, res) {
  try {
    let { title, description, due_date } = req.body;

    const task = await Task.findOne({ _id: req.params.id, userId: req.user._id });
    if (!task) return res.status(404).json({ message: "Task not found." });

    if (title !== undefined) {
      title = String(title).trim();
      if (!title) return res.status(400).json({ message: "Title cannot be empty." });
      task.title = title;
    }

    if (description !== undefined) {
      task.description = String(description).trim();
    }

    if (due_date !== undefined) {
      const due = new Date(due_date);
      if (isNaN(due.getTime())) {
        return res.status(400).json({ message: "Invalid due date format." });
      }
      task.due_date = due;
    }

    await task.save();

    return res.status(200).json({
      message: "Task updated successfully.",
      task
    });
  } catch (err) {
    return res.status(500).json({ message: "Task update failed.", error: err.message });
  }
}

// ✅ Update status (Drag & Drop)
async function updateTaskStatus(req, res) {
  try {
    const { status } = req.body;

    const allowed = ["pending", "in-progress", "completed"];
    if (!allowed.includes(status)) {
      return res.status(400).json({ message: "Invalid status value." });
    }

    const task = await Task.findOne({ _id: req.params.id, userId: req.user._id });
    if (!task) return res.status(404).json({ message: "Task not found." });

    task.status = status;
    await task.save();

    return res.status(200).json({
      message: "Status updated successfully.",
      task
    });
  } catch (err) {
    return res.status(500).json({ message: "Status update failed.", error: err.message });
  }
}

// ✅ Delete task
async function deleteTask(req, res) {
  try {
    const deleted = await Task.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!deleted) return res.status(404).json({ message: "Task not found." });

    return res.status(200).json({ message: "Task deleted successfully." });
  } catch (err) {
    return res.status(500).json({ message: "Task delete failed.", error: err.message });
  }
}

module.exports = {
  createTask,
  getMyTasks,
  updateTask,
  updateTaskStatus,
  deleteTask
};
