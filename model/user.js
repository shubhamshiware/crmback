const mongoose = require("mongoose");

const { Schema } = mongoose;

const usersSchema = new Schema({
  name: {
    type: String,

    trim: true, // Remove leading/trailing spaces
  },
  email: {
    type: String,
    unique: true,
    required: true,
    trim: true,
    lowercase: true,
  },
  about: {
    type: String,
    default: "",
    trim: true,
  },
  username: {
    type: String,
    unique: true,
    required: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["employee", "author", "admin"], // Define allowed roles
    default: "employee", // Default role is 'employee'
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const userModel = mongoose.model("user", usersSchema);

module.exports = userModel;
