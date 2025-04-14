const express = require("express");

const {
  accessChat,
  fetchChats,
  createGroupChat,
  renameGroup,
  addToGroup,
  removeFromGroup,
} = require("../controller/chats");
// import { protect } from "../middleware/authMiddleware.js";
const { protect } = require("../middleware/protect");
const router = express.Router();

router.post("/", protect, accessChat); // One-on-one chat
router.get("/", fetchChats); // Get all user's chats
router.post("/group", createGroupChat); // Create group
router.put("/rename", protect, renameGroup);
router.put("/groupadd", protect, addToGroup);
router.put("/groupremove", protect, removeFromGroup);

module.exports = router;
