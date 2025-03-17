const express = require("express");
const router = express.Router();
const meetingRepository = require("../repository/schedule");

// Route to save a client
router.post("/meeting", async (req, res) => {
  try {
    const result = await meetingRepository.saveData(req.body);
    res.status(201).json({ success: true, data: result });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Route to get all clients
router.get("/meeting", async (req, res) => {
  try {
    const clients = await meetingRepository.getData();
    res.status(200).json({ success: true, data: clients });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Route to update a client (e.g., add images)
router.put("/meeting", async (req, res) => {
  try {
    const result = await meetingRepository.editData(req.body);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

module.exports = router;
