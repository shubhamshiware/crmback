const jwt = require("jsonwebtoken");
const Attendance = require("../model/attendence");
const express = require("express");
// const { verifytoken } = require("../middleware/midd");
const mongoose = require("mongoose");
// const authMiddleware= require("../middleware/authmiddleware")
const router = express.Router();
const {
  getData,
  
} = require("../repository/attendence");


router.get("/", async (req, res) => {
  const data1 = await getData();
  res.json({ data: data1 });
});


const OFFICE_LOCATION = { latitude: 22.05911163145492, longitude: 78.92991505636398 }; // Example (Delhi)
const isWithinRange = (userLat, userLng) => {
    const distance = Math.sqrt(
      Math.pow(userLat - OFFICE_LOCATION.latitude, 2) + Math.pow(userLng - OFFICE_LOCATION.longitude, 2)
    );
    return distance < 0.01; // Adjust threshold (lower means more precise)
  };
  
  router.post("/attendance", async (req, res) => {
    try {
      console.log(req.body, "request body");
  
      const { userId, latitude, longitude } = req.body; 
    //   console.log(userId, latitude, longitude, "missing data");
  
      if (!userId || !latitude || !longitude) {
        return res.status(400).json({ message: "Missing required fields" });
      }
  
      // Check if user is within allowed range
      if (!isWithinRange(latitude, longitude)) {
        return res.status(403).json({ message: "You are not at the required location " });
      }
  
      // Get current time in hours
      const now = new Date();
      const currentHour = now.getHours(); // Get hours in 24-hour format
      console.log(currentHour,"hour")
  
      // Set attendance status based on time
      const attendanceStatus = currentHour >= 11 ? "Half Day" : "Present";
  console.log(attendanceStatus,"status")
      // Save attendance in database
      const attendance = new Attendance({
        userId, // Use correct field name
        date: now, // Save the current timestamp
        latitude,
        longitude,
        status: attendanceStatus,
      });
  
      await attendance.save();
  
      res.json({ 
        message: `Attendance marked successfully as ${attendanceStatus}`, 
        userId 
      });
    } catch (error) {
      console.error("Error marking attendance:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  
  

router.get("/:userId",  async (req, res) => {
    
    try {
        const { userId } = req.params;
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: "Invalid user ID" });
        }

        const attendanceRecords = await Attendance.find({ userId }).sort({ date: -1 });

        res.status(200).json(attendanceRecords);
    } catch (error) {
        console.error("Error fetching attendance:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

module.exports = router;

//this apis work is done just need to implement some condition if someone comes after
// it should show there a half day attandence  