const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  title: String,
  description: String,
  dueDate: Date,

  start: Date,
  end: Date,

  priority: {
    type: String,
    enum: ["Low", "Medium", "High"],
    default: "Medium",
  },
  status: { type: String, enum: ["Pending", "Completed"], default: "Pending" },
  assignedTo: String, // Team member
});

module.exports = mongoose.model("task", taskSchema);
