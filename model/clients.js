const mongoose = require("mongoose");

const clientSchema = new mongoose.Schema({
  company: { type: String, required: true },
  discription: { type: String },
  Address: { type: String },
  package: { type: Number },
  email: { type: String, required: true, match: /.+\@.+\..+/ },
  phone: { type: String, required: true },
  leadsgenerated: { type: Number },
  followers: { type: Number },
  views: { type: Number },
  profileImage: { type: String, default: "" },
  ctr: { type: Number },

  videos: [
    {
      videoNumber: { type: Number },
      isCompleted: { type: Boolean, default: false },
    },
  ],
  designs: [
    {
      designNumber: { type: Number },
      isCompleted: { type: Boolean, default: false },
    },
  ],
  date: { type: Date, required: true },
  assignedTo: { type: String },
  status: {
    type: String,
    enum: ["active", "not active"],
    default: "active", // Default status
  },
  addedAt: { type: Date, default: Date.now },
});

// Ensure exactly four videos and designs are present
clientSchema.pre("save", function (next) {
  if (this.videos.length !== 4) {
    return next(new Error("There must be exactly 4 videos."));
  }
  if (this.designs.length !== 4) {
    return next(new Error("There must be exactly 4 designs."));
  }
  next();
});

module.exports = mongoose.model("Client", clientSchema);
