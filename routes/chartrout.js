const express = require("express");
const router = express.Router();
const Sales = require("../model/chart");

// GET sales data
router.get("/", async (req, res) => {
  console.log("chart incoming", req.body);
  try {
    const data = await Sales.findOne();
    if (!data) return res.status(404).json({ message: "No sales data found" });
    res.json({ data });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/postdata", async (req, res) => {
  try {
    const exists = await Sales.findOne();
    if (exists)
      return res.status(400).json({ message: "Sales record already exists" });

    const sales = new Sales(); // defaults to 12 zeroes
    await sales.save();
    res.json({ message: "Sales record created", data: sales });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT update monthly sales
router.put("/update", async (req, res) => {
  console.log("update", req.body);
  const { monthIndex, value } = req.body; // monthIndex = 0 (Jan) to 11 (Dec)
  try {
    const sales = await Sales.findOne();
    if (!sales)
      return res.status(404).json({ message: "Sales record not found" });

    sales.monthlySalesBreakdown[monthIndex] = value;
    await sales.save();
    res.json({ message: "Sales updated successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
