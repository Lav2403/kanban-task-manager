const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },

    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 80
    },

    description: {
      type: String,
      default: "",
      trim: true,
      maxlength: 200
    },

    status: {
      type: String,
      enum: ["pending", "in-progress", "completed"],
      default: "pending",
      index: true
    },

    due_date: {
      type: Date,
      required: true
    }
  },
  { timestamps: true }
);

// ✅ Compound index for faster filtering
taskSchema.index({ userId: 1, status: 1 });

module.exports = mongoose.model("Task", taskSchema);
