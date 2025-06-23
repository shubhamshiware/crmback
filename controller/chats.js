const Chat = require("../model/chat");

const accessChat = async (req, res) => {
  cosnoel.log(req.body, "aa");
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
  console.log(req.body, "incomming request");
  try {
    const chats = await Chat.find().populate("users", "-password");
    res.json(chats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const groupchats = async (req, res) => {
  console.log("request from frontend", req.body);
  try {
    const grpChats = await Chat.find().populate("group", "-password");
    const user = chats.id.find().populate("user", "password");
    res.json(grpChats);
  } catch (error) {
    res.status(505).json({
      message: error.message,
    });
  }
};

const access = async (req, res) => {
  if (!useroId1 || !userId2) {
    return res.status(500).json({});
  }
};

module.exports = {
  accessChat,
  getAllChats,
  groupchats,
};
