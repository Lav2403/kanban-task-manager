require("dotenv").config();

const app = require("./app");
const connectDB = require("./config/db");
const cors = require("cors");

const PORT = process.env.PORT || 6001;

/**
 * ✅ CORS Setup
 * - For development: allow localhost
 * - For deployment: allow your Vercel domain (add later)
 */
app.use(
  cors({
    origin: [
      "http://localhost:5173", // ✅ Vite local frontend
      "http://localhost:3000"  // ✅ optional (if you ever use)
      // "https://your-vercel-project.vercel.app" ✅ add after deploying
    ],
    credentials: true
  })
);

// ✅ Handle unexpected errors (sync)
process.on("uncaughtException", (err) => {
  console.log("❌ Uncaught Exception:", err.message);
  process.exit(1);
});

// ✅ Start server only after DB is connected
async function startServer() {
  try {
    await connectDB();

    const server = app.listen(PORT, () => {
      console.log(`✅ Server is running on http://localhost:${PORT}`);
      console.log("✅ Environment:", process.env.NODE_ENV || "development");
    });

    // ✅ Handle unexpected errors (async)
    process.on("unhandledRejection", (err) => {
      console.log("❌ Unhandled Rejection:", err.message);
      server.close(() => process.exit(1));
    });
  } catch (err) {
    console.log("❌ Server failed to start:", err.message);
    process.exit(1);
  }
}

startServer();
