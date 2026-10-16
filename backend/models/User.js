const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false
    },
    studentId: {
      type: String,
      trim: true,
      default: ""
    },
    rollNumber: {
      type: String,
      trim: true,
      default: ""
    },
    department: {
      type: String,
      trim: true,
      default: "Computer Science & Engineering"
    },
    year: {
      type: String,
      trim: true,
      default: "3rd Year"
    },
    section: {
      type: String,
      trim: true,
      default: "A"
    },
    phone: {
      type: String,
      trim: true,
      default: ""
    },
    role: {
      type: String,
      enum: ["student", "admin"],
      default: "student"
    },
    settings: {
      notifications: { type: Boolean, default: true },
      emailUpdates: { type: Boolean, default: true },
      darkMode: { type: Boolean, default: false }
    }
  },
  { timestamps: true }
);

// Virtual for id
userSchema.virtual("id").get(function () {
  return this._id.toHexString();
});
userSchema.set("toJSON", { virtuals: true });

module.exports = mongoose.model("User", userSchema);