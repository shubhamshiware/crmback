const express = require("express");
const router = express.Router();
// const { accessChat } = require("../controller/chats");
const { accessChat, getAllChats } = require("../controller/chats");

router.get("/ ", getAllChats);
router.post("/chats", accessChat);

module.exports = router;
