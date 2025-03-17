const mongoose = require("mongoose");

const { Schema } = mongoose;

const usersSchema = new Schema({
  name: {
    type: String,

    trim: true, // Remove leading/trailing spaces
  },
  email: {
    type: String,
    unique: true, // Ensure no duplicate emails
    required: true, // Ensure email is provided
    trim: true,
    lowercase: true, // Store email in lowercase
  },
  about: {
    type: String,
    default: "", // Optional field for user bio
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
    required: true, // Ensure password is provided
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

// Create the model from the schema
const userModel = mongoose.model("user", usersSchema);

module.exports = userModel;
