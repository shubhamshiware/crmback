const express = require("express");
const router = express.Router();
const { accessChat } = require("../controller/chats");

router.post("/chats", accessChat);

module.exports = router;
