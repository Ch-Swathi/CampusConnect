const mongoose = require("mongoose");

const lostFoundSchema = new mongoose.Schema(
  {
    itemName: {
      type: String,
      required: true,
      trim: true
    },
    category: {
      type: String,
      required: true,
      trim: true
    },
    type: {
      type: String,
      enum: ["Lost", "Found"],
      required: true
    },
    location: {
      type: String,
      required: true,
      trim: true
    },
    date: {
      type: String,
      required: true
    },
    contact: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: true
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
    status: {
      type: String,
      enum: ["Active", "Resolved"],
      default: "Active"
    },
    datePosted: {
      type: String,
      default: () => new Date().toLocaleDateString()
    },
    image: {
      type: String,
      default: ""
    }
  },
  { timestamps: true }
);

lostFoundSchema.virtual("id").get(function () {
  return this._id.toHexString();
});
lostFoundSchema.set("toJSON", { virtuals: true });

module.exports = mongoose.model("LostFound", lostFoundSchema);
