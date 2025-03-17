const express = require("express");
const { verifytoken } = require("../middleware/midd");
const { ObjectId } = require("mongodb");
const salseSchema = require("../model/salse");

const router = express.Router();
const { roleCheck } = require("../middleware/middone");

const {
  getData,
  editData,
  deleteData,
  getDataById,
} = require("../repository/salse");
const userRepository = require("../repository/salse");

// Protected routes
router.get("/", async (req, res) => {
  const data1 = await getData();
  res.json({ data: data1 });
});

router.post("/salse", async (req, res) => {
  // console.log(req.body, "salse");
  try {
    const result = await userRepository.saveData(req.body);
    res.status(201).json({ success: true, data: result });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
  console.log("rout called ");
});

router.put("/edit", async (req, res) => {
  // console.log(req.body, "roless");
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

module.exports = router;
