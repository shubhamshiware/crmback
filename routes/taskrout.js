const express = require("express");
const router = express.Router();
const taskRepository = require("../repository/task");
const { editData, deleteData, getDataById } = require("../repository/task");
const { roleCheck } = require("../middleware/middone");
const { verifytoken } = require("../middleware/midd");

router.post("/task", async (req, res) => {
  console.log(req.body, "task");
  try {
    const result = await taskRepository.saveData(req.body);
    res.status(201).json({ success: true, data: result });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

router.get("/tasks", async (req, res) => {
  try {
    const clients = await taskRepository.getData();
    res.status(200).json({ success: true, data: clients });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

router.delete("/delete", async (req, res) => {
  // console.log("Request body:", req.body);
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

router.put("/task", roleCheck(["author"]), async (req, res) => {
  try {
    const result = await taskRepository.editData(req.body);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

router.put("/edit", roleCheck(["author"]), async (req, res) => {
  console.log("editt", req.body);
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

router.get("/:id", roleCheck(["author"]), async (req, res) => {
  // console.log("param", req.body);
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

router.delete(
  "/delete",

  roleCheck(["admin"]),
  async (req, res) => {
    const result = await deleteData(req.body.id);
    res.json({ message: "Data deleted", data: result });
  }
);

module.exports = router;
