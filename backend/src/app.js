const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const taskRoutes = require("./routes/taskRoutes");
const errorHandler = require("./middleware/errorMiddleware");

const app = express();

/**
 * ✅ Helpful when deploying behind reverse proxy (Render/Heroku/Nginx)
 */
app.set("trust proxy", 1);

/**
 * ✅ Body parsers (safe limits)
 */
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

/**
 * ✅ CORS Setup (Professional)
 * Supports single origin or multiple origins separated by commas in .env
 * Example: CLIENT_URL=http://localhost:5173,http://127.0.0.1:5173
 */
const allowedOrigins = (process.env.CLIENT_URL || "")
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (curl/postman)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) return callback(null, true);

      return callback(new Error("CORS blocked: Origin not allowed"), false);
    },
    credentials: true
  })
);

/**
 * ✅ Health Check Route (Industry Standard)
 */
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    message: "Server is healthy ✅",
    time: new Date().toISOString()
  });
});

/**
 * ✅ Main API Routes (Versioned)
 * Looks professional in interviews and real projects
 */
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/tasks", taskRoutes);

/**
 * ✅ 404 Handler
 */
app.use((req, res) => {
  res.status(404).json({
    message: "Route not found ❌",
    path: req.originalUrl
  });
});

/**
 * ✅ Global Error Handler (Always last)
 */
app.use(errorHandler);

module.exports = app;
