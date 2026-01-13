const bcrypt = require("bcrypt");
const User = require("../models/User");

/**
 * ✅ Get My Profile (Safe response)
 */
async function getMyProfile(req, res) {
  return res.status(200).json({
    id: req.user._id,
    name: req.user.name,
    email: req.user.email,
    createdAt: req.user.createdAt,
    updatedAt: req.user.updatedAt
  });
}

/**
 * ✅ Update My Profile
 * Allows updating name and/or password
 */
async function updateMyProfile(req, res) {
  try {
    let { name, password } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // ✅ Update name if provided
    if (name !== undefined) {
      name = String(name).trim();

      if (!name) {
        return res.status(400).json({ message: "Name cannot be empty." });
      }

      if (name.length > 50) {
        return res.status(400).json({ message: "Name is too long (max 50 characters)." });
      }

      user.name = name;
    }

    // ✅ Update password if provided
    if (password !== undefined) {
      password = String(password).trim();

      if (password.length < 6) {
        return res.status(400).json({ message: "Password must be at least 6 characters." });
      }

      user.password = await bcrypt.hash(password, 10);
    }

    await user.save();

    return res.status(200).json({
      message: "Profile updated successfully.",
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (err) {
    return res.status(500).json({
      message: "Profile update failed.",
      error: err.message
    });
  }
}

/**
 * ✅ Delete My Profile
 */
async function deleteMyProfile(req, res) {
  try {
    const deleted = await User.findByIdAndDelete(req.user._id);

    if (!deleted) {
      return res.status(404).json({ message: "User not found." });
    }

    return res.status(200).json({
      message: "Profile deleted successfully."
    });
  } catch (err) {
    return res.status(500).json({
      message: "Profile delete failed.",
      error: err.message
    });
  }
}

module.exports = { getMyProfile, updateMyProfile, deleteMyProfile };
