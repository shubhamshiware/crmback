const express = require("express");
// const { verifytoken } = require("../middleware/midd");
const mongoose = require("mongoose");
const router = express.Router();
const { roleCheck } = require("../middleware/middone");
const userRepository= require('../repository/repo')

const { encryptPassword } = require("../middleware/midd");
const { Signup, Login } = require("../controller/auth");
const {
  getData,
  editData,
  deleteData,
  getDataById,
} = require("../repository/repo");

const userSchema = require("../model/user");
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../controller/cloudinary"); // Cloudinary configuration file
 



const { Schema } = mongoose;
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "profile_pictures", // Folder where images will be stored in Cloudinary
    allowed_formats: ["jpg", "png", "jpeg"],
  },
});
const upload = multer({ storage });

// Public routes
router.post("/signup", encryptPassword, Signup);
router.post(
  "/login",

  Login
);

router.get("/", async (req, res) => {
  const data1 = await getData();
  res.json({ data: data1 });
});

router.post("/task", async (req, res) => {
  try {
    const result = await taskRepository.saveData(req.body);
    res.status(201).json({ success: true, data: result });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

router.put("/edit", async (req, res) => {
  const result = await editData(req.body);
  res.json({ message: "Data updated", data: result });
});

router.delete(
  "/delete",

  roleCheck(["admin"]),
  async (req, res) => {
    const result = await deleteData(req.body.id);
    res.json({ message: "Data deleted", data: result });
  }
);

router.get(
  "/dashboard",

  roleCheck(["author", "employee"]),
  async (req, res) => {
    try {
      const updates = await Dashboard.find();
      res.status(200).json(updates);
    } catch (error) {
      res.status(500).json({ message: "Server Error" });
    }
  }
);

router.get("/user/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const client = await userRepository.getDataById(id);

    if (!client) {
      return res
        .status(404)
        .json({ success: false, message: "Client not found" });
    }

    res.status(200).json({ success: true, data: client });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});


router.post("/imgupload/:id", upload.single("image"), async (req, res) => {
  try {
    console.log(req.body, "Request Body");
    console.log(req.file, "Uploaded File");

    const { userId } = req.body;
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // ✅ Ensure Cloudinary URL is used
    const imageUrl = req.file.path; // This should now be the Cloudinary URL

    // Update user profile with Cloudinary image URL
    const updatedUser = await userSchema.findByIdAndUpdate(
      userId,
      { profileImage: imageUrl },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Profile image updated!",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error uploading image:", error);
    res.status(500).json({ message: "Failed to upload image" });
  }
});

module.exports = router;

//veryfy middlewere works bit late that neds to be improved fro production
