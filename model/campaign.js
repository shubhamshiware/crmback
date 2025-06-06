const mongoose = require("mongoose");

const campaignSchema = new mongoose.Schema({
  client: String,
  campaignName: String,
  startDate: Date,
  endDate: Date,
  progress: { type: Number, default: 0 },
  budget: Number,
});

module.exports = mongoose.model("campaign", campaignSchema);
