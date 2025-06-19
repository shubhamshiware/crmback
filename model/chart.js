const mongoose = require("mongoose");

const SalesSchema = new mongoose.Schema({
  monthlySalesBreakdown: {
    type: [Number], // Array of 12 numbers: Jan to Dec
    default: Array(12).fill(0),
  },
});

module.exports = mongoose.model("Sales", SalesSchema);
