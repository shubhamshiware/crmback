const Chat = require("../model/chat");

const accessChat = async (req, res) => {
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

module.exports = { accessChat };
