const express = require("express");
const app = express();
const mongoose = require("mongoose");
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
const chartRout = require("./routes/chartrout");

// MongoDB URI
const mongoUri =
  "mongodb+srv://user123:EHc0dB43WpqycSvE@cluster0.7lhwy.mongodb.net/manage?retryWrites=true&w=majority";

// CORS Middleware (✅ update with your frontend origin)
app.use(
  cors({
    origin: "https://crmfrontend-s254.onrender.com",
    credentials: true,
  })
);

// Other Middleware
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
app.use("/Chart", chartRout);

// MongoDB Connection
const dbConnect = () => {
  return mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
};

// Start Server
const PORT = 8089;
dbConnect()
  .then(() => {
    console.log("✅ Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
  });
