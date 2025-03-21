const express = require("express");
const router = express.Router();
const contentRout = require("../repository/content");
const repo = require("../model/content");

router.post("/content", async (req, res) => {
  try {
    const { userId, update } = req.body;
    if (!userId)
      return res.status(400).json({ message: "User ID is required" });

    const newTask = new repo({ userId, update });
    await newTask.save();

    res.status(201).json({ message: "Task added successfully", data: newTask });
  } catch (error) {
    res.status(500).json({ message: "Error adding task", error });
  }
});

// Route to get all clients
router.get("/", async (req, res) => {
  try {
    const clients = await contentRout.getData();
    res.status(200).json({ success: true, data: clients });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

router.put("/edit", async (req, res) => {
  console.log(req.body, "testing video & Design");
  try {
    const { _id, update, completed } = req.body;

    // Validate required fields
    if (!_id || typeof update !== "object") {
      return res.status(400).json({ error: "Missing _id or update field" });
    }

    // Find the task
    const task = await repo.findById(_id);
    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    // Prepare update object
    let updateFields = { ...update };
    if (completed !== undefined) updateFields.completed = completed;

    // Update points dynamically
    if (typeof update.points === "number") {
      updateFields.points =
        (task.points || 0) + (completed ? update.points : -update.points);
    }

    // Update task in the database
    const updatedTask = await repo.findByIdAndUpdate(
      _id,
      { $set: updateFields },
      { new: true }
    );

    console.log(" Updated Task:", updatedTask);
    res.json(updatedTask);
  } catch (err) {
    console.error(" Error updating task:", err);
    res.status(500).json({ error: err.message });
  }
});

router.get("/users/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const tasks = await Content.find({ userId }); // Fetch only tasks for this user

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Error fetching tasks", error });
  }
});

router.delete("/content/:id", async (req, res) => {
  try {
    await repo.findByIdAndDelete(req.params.id);
    res.json({ message: "Task deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
