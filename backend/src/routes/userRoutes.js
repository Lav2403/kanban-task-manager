const express = require("express");
const protect = require("../middleware/authMiddleware");
const {
  getMyProfile,
  updateMyProfile,
  deleteMyProfile
} = require("../controllers/userController");

const router = express.Router();

router.get("/me", protect, getMyProfile);
router.put("/me", protect, updateMyProfile);
router.delete("/me", protect, deleteMyProfile);

module.exports = router;
