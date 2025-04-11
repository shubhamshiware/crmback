// import Message from "../model/message.js";
// import Chat from "../model/chat.js";
const Message = require("../model/message.js");
const Chat = require("../model/chat.js");

const sendMessage = async (req, res) => {
  const { content, chatId } = req.body;

  if (!content || !chatId) return res.status(400).send("Invalid data");

  const newMessage = await Message.create({
    sender: req.user._id,
    content,
    chat: chatId,
  });

  const fullMessage = await Message.findById(newMessage._id)
    .populate("sender", "name email")
    .populate("chat");

  await Chat.findByIdAndUpdate(chatId, { latestMessage: fullMessage });

  res.json(fullMessage);
};

const allMessages = async (req, res) => {
  const messages = await Message.find({ chat: req.params.chatId })
    .populate("sender", "name email")
    .populate("chat");

  res.json(messages);
};

module.exports = {
  allMessages,
  sendMessage,
};
