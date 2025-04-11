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
const router = express.Router();

router.post("/", accessChat); // One-on-one chat
router.get("/", fetchChats); // Get all user's chats
router.post("/group", createGroupChat); // Create group
router.put("/rename", renameGroup);
router.put("/groupadd", addToGroup);
router.put("/groupremove", removeFromGroup);

module.exports = router;
