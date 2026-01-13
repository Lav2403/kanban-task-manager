const bcrypt = require("bcrypt");
const User = require("../models/User");
const generateToken = require("../utils/generateToken");

/**
 * ✅ SIGNUP Controller
 * Creates a new user with hashed password and returns JWT token
 */
async function signup(req, res) {
  try {
    let { name, email, password } = req.body;

    name = (name || "").trim();
    email = (email || "").trim().toLowerCase();
    password = (password || "").trim();

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "All fields are required: name, email, password."
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters."
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        message: "Email already exists. Please use a different email."
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword
    });

    const token = generateToken(user._id);

    return res.status(201).json({
      message: "Account created successfully.",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (err) {
    return res.status(500).json({
      message: "Something went wrong while creating account.",
      error: err.message
    });
  }
}

/**
 * ✅ LOGIN Controller
 * Verifies credentials and returns JWT token
 */
async function login(req, res) {
  try {
    let { email, password } = req.body;

    email = (email || "").trim().toLowerCase();
    password = (password || "").trim();

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required."
      });
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password."
      });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({
        message: "Invalid email or password."
      });
    }

    const token = generateToken(user._id);

    return res.status(200).json({
      message: "Login successful.",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (err) {
    return res.status(500).json({
      message: "Something went wrong while logging in.",
      error: err.message
    });
  }
}

/**
 * ✅ LOGOUT Controller
 * Token removal is managed on frontend in JWT flow
 */
async function logout(req, res) {
  return res.status(200).json({
    message: "Logout successful."
  });
}

module.exports = { signup, login, logout };
