const cloudinary = require("cloudinary").v2;
require("dotenv").config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

module.exports = cloudinary;

//secret key - ubLkXmhUp7oh4KnbCf0XE2KMjFI
//api key - 743863682556275
//cloud name - dhvgqn6nh
