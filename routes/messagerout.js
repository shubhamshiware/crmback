const express = require("express");

const { allMessages, sendMessage } = require("../controller/messages");
const { protect } = require("../middleware/protect");
// import { protect } from "../middleware/authMiddleware.js";
const router = express.Router();

router.get("/:chatId", protect, allMessages);
router.post("/", protect, sendMessage);

module.exports = router;
