// import Chat from "../model/chat.js";
// import User from "../model/message.js";
const Chat = require("../model/chat.js");

const accessChat = async (req, res) => {
  const { userId } = req.body;

  if (!userId) return res.status(400).send("UserId is required");

  let chat = await Chat.findOne({
    isGroupChat: false,
    users: { $all: [req.user._id, userId] },
  })
    .populate("users", "-password")
    .populate("latestMessage");

  if (chat) return res.send(chat);

  // Create new if not exists
  const newChat = await Chat.create({
    chatName: "sender",
    isGroupChat: false,
    users: [req.user._id, userId],
  });

  const fullChat = await Chat.findById(newChat._id).populate(
    "users",
    "-password"
  );
  res.status(200).json(fullChat);
};

const fetchChats = async (req, res) => {
  const chats = await Chat.find({ users: { $in: [req.user._id] } })
    .populate("users", "-password")
    .populate("groupAdmin", "-password")
    .populate("latestMessage")
    .sort({ updatedAt: -1 });

  res.status(200).json(chats);
};

const createGroupChat = async (req, res) => {
  const { users, name } = req.body;

  if (!users || !name) return res.status(400).send("Missing fields");

  const parsedUsers = JSON.parse(users);
  if (parsedUsers.length < 2)
    return res.status(400).send("Group must have 3+ members");

  parsedUsers.push(req.user);

  const groupChat = await Chat.create({
    chatName: name,
    users: parsedUsers,
    isGroupChat: true,
    groupAdmin: req.user,
  });

  const fullGroupChat = await Chat.findById(groupChat._id)
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  res.status(200).json(fullGroupChat);
};

const renameGroup = async (req, res) => {
  const { chatId, chatName } = req.body;

  const updatedChat = await Chat.findByIdAndUpdate(
    chatId,
    { chatName },
    { new: true }
  ).populate("users", "-password");

  if (!updatedChat) return res.status(404).send("Chat not found");

  res.json(updatedChat);
};

const addToGroup = async (req, res) => {
  const { chatId, userId } = req.body;

  const chat = await Chat.findByIdAndUpdate(
    chatId,
    { $push: { users: userId } },
    { new: true }
  ).populate("users", "-password");

  res.json(chat);
};

const removeFromGroup = async (req, res) => {
  const { chatId, userId } = req.body;

  const chat = await Chat.findByIdAndUpdate(
    chatId,
    { $pull: { users: userId } },
    { new: true }
  ).populate("users", "-password");

  res.json(chat);
};

module.exports = {
  removeFromGroup,
  addToGroup,
  renameGroup,
  createGroupChat,
  fetchChats,
  accessChat,
};
