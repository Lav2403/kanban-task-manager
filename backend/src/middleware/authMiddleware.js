const jwt = require("jsonwebtoken");
const User = require("../models/User");

async function protect(req, res, next) {
  try {
    const authHeader = req.headers.authorization || "";

    if (!authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Unauthorized. Please provide a valid Bearer token."
      });
    }

    const token = authHeader.split(" ")[1];

    if (!process.env.JWT_SECRET) {
      return res.status(500).json({
        message: "Server configuration error: JWT_SECRET missing."
      });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      // ✅ token expired / invalid token handling
      if (err.name === "TokenExpiredError") {
        return res.status(401).json({ message: "Session expired. Please login again." });
      }
      return res.status(401).json({ message: "Invalid token. Please login again." });
    }

    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({
        message: "Unauthorized. User does not exist."
      });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({
      message: "Unauthorized access."
    });
  }
}

module.exports = protect;
