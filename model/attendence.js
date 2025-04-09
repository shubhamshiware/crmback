const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  date: { type: Date, required: true },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  status: { type: String, default: "Present" },
});

module.exports = mongoose.model("Attendance", attendanceSchema);

//this is an attandence schema
