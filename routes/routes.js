const express = require("express");
const { verifytoken } = require("../middleware/midd");
const mongoose = require("mongoose");
const router = express.Router();
const { roleCheck } = require("../middleware/middone");

const { encryptPassword } = require("../middleware/midd");
const { Signup, Login } = require("../controller/auth");
const {
  getData,
  editData,
  deleteData,
  getDataById,
} = require("../repository/repo");
const userRepository = require("../repository/repo");

// Public routes
router.post("/signup", encryptPassword, Signup);
router.post(
  "/login",

  Login
);

// Protected routes
//verify token is working fine but somtimes it doesnt work properly
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

module.exports = router;
