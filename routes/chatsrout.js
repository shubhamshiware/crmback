const express = require("express");
const router = express.Router();
const { accessChat } = require("../controller/chats");
const { sendMessage, getMessages } = require("../controller/messages");

router.post("/ms", sendMessage);
router.get("/:chatId", getMessages);

router.post("/", accessChat);

module.exports = router;
