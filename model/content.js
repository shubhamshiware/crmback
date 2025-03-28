const mongoose = require("mongoose");

const contentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  update: String,
  completed: { type: Boolean, default: false },
  points: { type: Number, default: 0 },
  uploadedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("content", contentSchema);

