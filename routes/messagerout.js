const express = require("express");

const { allMessages, sendMessage } = require("../controller/messages");
// import { protect } from "../middleware/authMiddleware.js";
const router = express.Router();

router.get("/:chatId", allMessages);
router.post("/", sendMessage);

module.exports = router;
