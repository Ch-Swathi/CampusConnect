const mongoose = require("mongoose");

const announcementSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    message: {
      type: String,
      required: true,
      trim: true
    },
    important: {
      type: Boolean,
      default: false
    },
    date: {
      type: String,
      default: () => new Date().toLocaleDateString()
    },
    author: {
      type: String,
      default: "Admin"
    }
  },
  { timestamps: true }
);

announcementSchema.virtual("id").get(function () {
  return this._id.toHexString();
});
announcementSchema.set("toJSON", { virtuals: true });

module.exports = mongoose.model("Announcement", announcementSchema);
