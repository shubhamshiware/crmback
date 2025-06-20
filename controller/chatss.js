const chat = require("../model/chat");
const Chat = require("../models/Chat");
const User = require("../models/User");

// Create or fetch one-to-one chat
const accessChat = async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    console.log("❌ User ID not sent with request");
    return res.status(400).send("User ID required");
  }

  try {
    // Check if chat already exists
    let chat = await Chat.findOne({
      isChatGroup: false,
      users: { $all: [req.user._id, userId] },
    })
      .populate("users", "-password")
      .populate("latestMessage");

    if (chat) {
      return res.status(200).json(chat);
    }

    // Create new chat
    const newChat = new Chat({
      chatName: "sender",
      isChatGroup: false,
      users: [req.user._id, userId],
    });

    const createdChat = await newChat.save();

    const fullChat = await Chat.findById(createdChat._id).populate(
      "users",
      "-password"
    );

    res.status(201).json(fullChat);
  } catch (error) {
    console.error("Error creating chat:", error);
    res.status(500).send("Server error");
  }
};

const fetchChat = async (req, res) => {
  try {
    const chaat = await chat
      .find({ Users: { $in: [req.user._id] } })
      .populate("chat", "-password")
      .populate("groupchat", "-password")
      .populate("latestmesaage")
      .sort("updateAt:-1");

    res.status(200).json(chats);
  } catch (err) {
    console.log("some error ocuured while initialising the chat ", err);
    res.status(500).json({
      error: "error occured ",
    });
  }
};

// Create a new group chat
const createGroupChat = async (req, res) => {
  const { name, users } = req.body;

  if (!name || !users) {
    return res
      .status(400)
      .json({ message: "Please provide group name and users" });
  }

  const parsedUsers = JSON.parse(users);

  if (parsedUsers.length < 2) {
    return res
      .status(400)
      .json({ message: "At least 2 users required to form a group chat" });
  }

  parsedUsers.push(req.user); // include the creator

  try {
    const groupChat = await Chat.create({
      chatName: name,
      users: parsedUsers,
      isChatGroup: true,
      groupAdmin: req.user._id,
    });

    const fullGroupChat = await Chat.findById(groupChat._id)
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    res.status(201).json(fullGroupChat);
  } catch (error) {
    console.error("Error creating group chat:", error);
    res.status(500).send("Server error");
  }
};

module.exports = {
  accessChat,
  fetchChat,
  createGroupChat,
};

// const fetchChats = async (req, res) => {
//     try {
//       const chats = await Chat.find({ users: { $in: [req.user._id] } })
//         .populate("users", "-password")
//         .populate("groupAdmin", "-password")
//         .populate("latestMessage")
//         .sort({ updatedAt: -1 });

//       res.status(200).json(chats);
//     } catch (error) {
//       console.error("Error fetching chats:", error);
//       res.status(500).send("Server error");
//     }
//   };
