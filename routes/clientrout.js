const express = require("express");
const router = express.Router();
// const clientRepository = require("../repository/client");
const { verifytoken } = require("../middleware/midd");
const { editData, deleteData, getDataById } = require("../repository/client");
const clientRepository = require("../repository/client");
const clientSchema = require("../model/clients");
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../controller/cloudinary");

const mongoose = require("mongoose");

const { Schema } = mongoose;
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "profile_pictures",
    allowed_formats: ["jpg", "png", "jpeg"],
  },
});
const upload = multer({ storage });
// Route to save a client
router.post("/clients", async (req, res) => {
  try {
    const result = await clientRepository.saveData(req.body);
    res.status(201).json({ success: true, data: result });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Route to get all clients
router.get("/clients", async (req, res) => {
  try {
    const clients = await clientRepository.getData();
    res.status(200).json({ success: true, data: clients });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

router.delete("/delete", async (req, res) => {
  try {
    const { id } = req.body;
    if (!id) {
      return res.status(400).json({ message: "Client ID is required" });
    }
    const result = await deleteData(id);
    if (!result) {
      return res.status(404).json({ message: "Client not found" });
    }
    res.status(200).json({ message: "Client deleted successfully" });
  } catch (error) {
    console.error("Error in delete route:", error);
    res.status(500).json({ message: "Failed to delete client" });
  }
});

router.put("/edit", async (req, res) => {
  try {
    const result = await clientRepository.editData(req.body);

    if (result.matchedCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Client not found",
      });
    }

    if (result.modifiedCount === 0) {
      return res.status(200).json({
        success: true,
        message: "No changes were made to the client",
      });
    }

    res.status(200).json({
      success: true,
      message: "Client updated successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

router.put("/edit", async (req, res) => {
  try {
    const result = await clientRepository.editData(req.body);

    if (result.matchedCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Client not found",
      });
    }

    if (result.modifiedCount === 0) {
      return res.status(200).json({
        success: true,
        message: "No changes were made to the client",
      });
    }

    res.status(200).json({
      success: true,
      message: "Client updated successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

router.put("/:id/leads", async (req, res) => {
  try {
    const { leadsgenerated, followers, views, ctr } = req.body;

    // Ensure all values are converted to numbers (if applicable)
    const updatedData = {
      ...(leadsgenerated !== undefined && {
        leadsgenerated: Number(leadsgenerated),
      }),
      ...(followers !== undefined && { followers: Number(followers) }),
      ...(views !== undefined && { views: Number(views) }),
      ...(ctr !== undefined && { ctr: Number(ctr) }), // <-- Corrected line
    };

    const result = await clientSchema.findByIdAndUpdate(
      req.params.id,
      { $set: updatedData },
      { new: true, runValidators: true } // Ensure the document is updated & returned
    );

    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Client not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Client updated successfully",
      data: result,
    });
  } catch (error) {
    console.error("Error updating client:", error);
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

router.put("/:id/update-status", async (req, res) => {
  const { id } = req.params;
  const { itemIndex, isCompleted, type } = req.body;

  // Validate ID format
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid client ID format." });
  }

  try {
    const client = await clientSchema.findById(id);

    if (!client) {
      return res.status(404).json({ message: "Client not found." });
    }

    // Handle both singular and plural types
    if (type === "videos" || type === "video") {
      if (!Array.isArray(client.videos) || client.videos.length === 0) {
        return res.status(400).json({
          message: "The videos array does not exist or is empty.",
        });
      }

      // Check if itemIndex is valid
      if (itemIndex < 0 || itemIndex >= client.videos.length) {
        return res.status(400).json({
          message: "The itemIndex is invalid.",
        });
      }

      // Update the task status
      client.videos[itemIndex].isCompleted = isCompleted;

      const updatedClient = await client.save();
      if (!updatedClient) {
        return res.status(500).json({
          success: false,
          message: "Failed to update task status.",
        });
      }

      return res.json({
        success: true,
        message: "Video status updated successfully.",
        data: updatedClient,
      });
    }

    // Handle Design Section
    else if (type === "designs" || type === "design") {
      if (!Array.isArray(client.designs) || client.designs.length === 0) {
        return res.status(400).json({
          message: "The designs array does not exist or is empty.",
        });
      }

      if (itemIndex < 0 || itemIndex >= client.designs.length) {
        return res.status(400).json({
          message: "The itemIndex is invalid.",
        });
      }

      // Update the task status
      client.designs[itemIndex].isCompleted = isCompleted;

      // Attempt to save the data
      const updatedClient = await client.save();
      if (!updatedClient) {
        return res.status(500).json({
          success: false,
          message: "Failed to update task status.",
        });
      }

      // Send success response
      return res.json({
        success: true,
        message: "Design status updated successfully.",
        data: updatedClient,
      });
    }

    // Handle invalid type
    else {
      console.error("Invalid type received:", type);
      return res.status(400).json({
        message: "Invalid type. Must be either 'videos' or 'designs'.",
      });
    }
  } catch (error) {
    console.error("❌ Error updating status:", error.message);

    // Prevent server from crashing and send error message
    return res.status(500).json({
      success: false,
      message: "Server error. Task status could not be updated.",
      error: error.message,
    });
  }
});

router.put("/:id/update-package", async (req, res) => {
  try {
    const { newAmount } = req.body;
    if (newAmount < 0) {
      return res.status(400).json({ message: "Invalid package amount" });
    }

    const updatedClient = await clientSchema.findByIdAndUpdate(
      req.params.id,
      { package: newAmount },
      { new: true }
    );

    if (!updatedClient) {
      return res.status(404).json({ message: "Client not found" });
    }

    res.json({
      success: true,
      message: "Package amount updated",
      data: updatedClient,
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const client = await clientRepository.getDataById(id);

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

router.post("/:id/upload", upload.single("image"), async (req, res) => {
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
    const updatedUser = await clientSchema.findByIdAndUpdate(
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
