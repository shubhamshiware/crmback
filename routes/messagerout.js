const express = require("express");
const router = express.Router();
const { sendMessage, getMessages } = require("../controller/messages");

router.post("/", sendMessage);
router.get("/:chatId", getMessages);

module.exports = router;
