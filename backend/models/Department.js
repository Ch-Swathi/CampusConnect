const mongoose = require("mongoose");

const departmentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    description: {
      type: String,
      default: "",
      trim: true
    }
  },
  { timestamps: true }
);

departmentSchema.virtual("id").get(function () {
  return this._id.toHexString();
});
departmentSchema.set("toJSON", { virtuals: true });

module.exports = mongoose.model("Department", departmentSchema);
