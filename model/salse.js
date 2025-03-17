const mongoose = require("mongoose");

const salseSchema = new mongoose.Schema({
  totalClients: {
    type: Number,
    required: true,
  },
  salesToday: {
    type: Number,
    required: true,
  },
  monthlySales: {
    type: Number,
    required: true,
  },
  yearlySales: {
    type: Number,
    required: true,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Salse", salseSchema);
