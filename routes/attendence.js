const jwt = require("jsonwebtoken");
const Attendance = require("../model/attendence");
const express = require("express");
// const { verifytoken } = require("../middleware/midd");
const mongoose = require("mongoose");
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

// ✅ Attendance API
router.post("/attendance", async (req, res,id) => {
    console.log(id,"userid")
  const { latitude,longitude } = req.body;

  if (!latitude || !longitude) {
    return res.status(400).json({ message: "Location data missing" });
  }

  const isAllowed = isWithinRange(latitude, longitude);

  if (!isAllowed) {
    return res.status(403).json({ message: "You are not at the required location" });
  }

  const attendance = new Attendance({
    userId: id, // Replace with JWT user id
    date: new Date(),
    latitude,
    longitude,
    status: "Present",
  });

  await attendance.save();
  res.json({ message: "Attendance marked successfully" ,
    userid:id
  });
});

module.exports = router;