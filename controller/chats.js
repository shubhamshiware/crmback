const Chat = require("../model/chat");

const accessChat = async (req, res) => {
  console.log(req.body, "incoming message");
  if (!userId1 || !userId2) {
    return res.status(400).json({ message: "Missing user IDs" });
  }

  const { userId1, userId2 } = req.body;

  try {
    let chat = await Chat.findOne({
      isGroupChat: false,
      users: { $all: [userId1, userId2] },
    }).populate("users", "-password");

    if (!chat) {
      chat = await Chat.create({
        chatName: "sender",
        users: [userId1, userId2],
      });
    }

    res.json(chat);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllChats = async (req, res) => {
  try {
    const chats = await Chat.find().populate("users", "-password");
    res.json(chats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  accessChat,
  getAllChats,
};
