const express = require("express");
const app = express();
const mongoose = require("mongoose");
const http = require("http"); // <-- required for socket.io
const socketIO = require("socket.io");
const cors = require("cors");
const bodyParser = require("body-parser");

// Routes
const authRoute = require("./routes/routes");
const rootRout = require("./routes/routes");
const clientRout = require("./routes/clientrout");
const meetingRout = require("./routes/meetingrout");
const taskRout = require("./routes/taskrout");
const contentRout = require("./routes/contentrout");
const salseRout = require("./routes/salserout");
const attendenceRout = require("./routes/attendence");
const chatRout = require("./routes/chatsrout");
// const messageRout = require("./routes/messagerout");
const { Server } = require("socket.io");

const mongoUri =
  "mongodb+srv://user123:EHc0dB43WpqycSvE@cluster0.7lhwy.mongodb.net/manage?retryWrites=true&w=majority";

// Create HTTP server and attach Socket.IO

const server = http.createServer(app);

// ✅ Use your frontend URL here
const io = new Server(server, {
  cors: {
    origin: "https://crmfrontend-s254.onrender.com", // your React frontend
    methods: ["GET", "POST"],
    credentials: true,
  },
});

app.use(
  cors({
    origin: "https://crmfrontend-s254.onrender.com",
    credentials: true,
  })
);

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());
app.use(express.static("uploads"));
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/", rootRout);
app.use("/auth", authRoute);
app.use("/client", clientRout);
app.use("/meeting", meetingRout);
app.use("/task", taskRout);
app.use("/content", contentRout);
app.use("/salse", salseRout);
app.use("/attendence", attendenceRout);
app.use("/chat", chatRout);
// app.use("/message", messageRout);

// MongoDB Connection
const dbConnect = () => {
  return mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
};

// Socket.IO connection
io.on("connection", (socket) => {
  console.log("⚡ New client connected:", socket.id);

  socket.on("join chat", (room) => {
    socket.join(room);
    console.log(`User joined room: ${room}`);
  });

  socket.on("new message", (newMessage) => {
    const chat = newMessage.chat;

    if (!chat.users) return;

    chat.users.forEach((user) => {
      if (user._id !== newMessage.sender._id) {
        socket.to(user._id).emit("message received", newMessage);
      }
    });
  });

  socket.on("disconnect", () => {
    console.log("🔌 Client disconnected:", socket.id);
  });
});

// Start Server
dbConnect()
  .then(() => {
    console.log("✅ Connected to MongoDB");
    server.listen(8089, () => {
      console.log("🚀 Server running on http://localhost:8089");
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
  });
