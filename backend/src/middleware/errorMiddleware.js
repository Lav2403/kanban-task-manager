function errorHandler(err, req, res, next) {
    const statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;
  
    // ✅ Useful server-side log (professional)
    console.log("❌ Error:", {
      method: req.method,
      path: req.originalUrl,
      message: err.message
    });
  
    // ✅ Handle common Mongoose errors
    let message = err.message || "Something went wrong.";
    if (err.name === "CastError") {
      message = "Invalid ID format.";
    }
  
    if (err.name === "ValidationError") {
      message = "Validation error. Please check your inputs.";
    }
  
    if (err.code === 11000) {
      message = "Duplicate data found. This value already exists.";
    }
  
    return res.status(statusCode).json({
      success: false,
      message,
      ...(process.env.NODE_ENV === "development" && { stack: err.stack })
    });
  }
  
  module.exports = errorHandler;
  