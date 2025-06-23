const mongoose = require("mongoose");

const chatssSchema = new mongoose.Schema({
  chatName: {
    type: String,
    trim: true,
  },
  isChatGroup: {
    type: Boolean,
    default: false,
  },
  users: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
  ],
  latestMessage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  groupAdmin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
});

module.exports = mongoose.model("chat", chatssSchema);
