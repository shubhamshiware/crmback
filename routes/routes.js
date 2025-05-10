const express = require("express");
// const { verifytoken } = require("../middleware/midd");
const mongoose = require("mongoose");
const router = express.Router();
const { roleCheck } = require("../middleware/middone");
const userRepository = require("../repository/repo");

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

  async (req, res) => {
    console.log("delete called");
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

router.post("/:id/imgupload", upload.single("image"), async (req, res) => {
  try {
    console.log(req.body, "Request Body");
    console.log(req.file, "Uploaded File");

    const { id } = req.params; // ✅ Get user ID from URL parameters
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const imageUrl = req.file.path; // ✅ Cloudinary URL

    // ✅ Check if user exists
    const user = await userSchema.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // ✅ Update user with profile image
    user.profileImage = imageUrl;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Profile image updated!",
      user,
    });
  } catch (error) {
    console.error("Error uploading image:", error);
    res
      .status(500)
      .json({ message: "Failed to upload image", error: error.message });
  }
});

module.exports = router;
