const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 50
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address."]
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false // ✅ hide password by default
    }
  },
  { timestamps: true }
);

/**
 * ✅ Removes password field in responses automatically
 */
userSchema.set("toJSON", {
  transform: function (doc, ret) {
    delete ret.password;
    return ret;
  }
});

module.exports = mongoose.model("User", userSchema);
