const mongoose = require("mongoose");

const meetingSchema = new mongoose.Schema({
  update: String,
  date: Date,
  time: String,
  meetingType: { type: String, enum: ["In-person", "Video Call"] },
  notes: String,
});

module.exports = mongoose.model("meeting", meetingSchema);

//unused schema
