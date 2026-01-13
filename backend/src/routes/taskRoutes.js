const express = require("express");
const protect = require("../middleware/authMiddleware");

const {
  createTask,
  getMyTasks,
  updateTask,
  updateTaskStatus,
  deleteTask
} = require("../controllers/taskController");

const router = express.Router();

router.get("/", protect, getMyTasks);
router.post("/", protect, createTask);
router.put("/:id", protect, updateTask);
router.patch("/:id/status", protect, updateTaskStatus);
router.delete("/:id", protect, deleteTask);

module.exports = router;
