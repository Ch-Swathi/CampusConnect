const mongoose = require("mongoose");

const complaintSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    category: {
      type: String,
      required: true,
      trim: true
    },
    department: {
      type: String,
      required: true,
      trim: true
    },
    location: {
      type: String,
      required: true,
      trim: true
    },
    priority: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Medium"
    },
    description: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: ["Pending", "In Progress", "Resolved", "Rejected"],
      default: "Pending"
    },
    student: {
      type: String,
      required: true,
      trim: true
    },
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    adminRemarks: {
      type: String,
      default: ""
    },
    date: {
      type: String,
      default: () => new Date().toLocaleDateString()
    }
  },
  { timestamps: true }
);

complaintSchema.virtual("id").get(function () {
  return this._id.toHexString();
});
complaintSchema.set("toJSON", { virtuals: true });

module.exports = mongoose.model("Complaint", complaintSchema);
