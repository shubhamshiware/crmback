const Message = require("../model/message");
const Chat = require("../model/chat");

const sendMessage = async (req, res) => {
  // console.log("content", content);
  const { senderId, content, chatId } = req.body;

  try {
    const newMessage = await Message.create({
      sender: senderId,
      content,
      chat: chatId,
    });

    await Chat.findByIdAndUpdate(chatId, { latestMessage: newMessage.id });

    const fullMessage = await Message.findById(newMessage.id)
      .populate("sender", "name email")
      .populate("chat");

    res.json(fullMessage);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMessages = async (req, res) => {
  const { chatId } = req.params;

  try {
    console.log(req.body, "messagesrout getmessage");
    const messages = await Message.find({ chat: chatId })
      .populate("sender", "name email")
      .sort({ createdAt: 1 });

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { sendMessage, getMessages };
