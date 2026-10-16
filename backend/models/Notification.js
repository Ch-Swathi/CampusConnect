const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null // null means broadcast to all users
    },
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
    type: {
      type: String,
      default: "System"
    },
    important: {
      type: Boolean,
      default: false
    },
    date: {
      type: String,
      default: () => new Date().toLocaleDateString()
    },
    read: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

notificationSchema.virtual("id").get(function () {
  return this._id.toHexString();
});
notificationSchema.set("toJSON", { virtuals: true });

module.exports = mongoose.model("Notification", notificationSchema);
