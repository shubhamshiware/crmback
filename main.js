const express = require("express");
const app = express();
const mongoose = require("mongoose");
const authRoute = require("./routes/routes");
const rootRout = require("./routes/routes");
const clientRout = require("./routes/clientrout");
const meetingRout = require("./routes/meetingrout");
const taskRout = require("./routes/taskrout");
const contentRout = require("./routes/contentrout");
const salseRout = require("./routes/salserout");
const cors = require("cors");
const bodyParser = require("body-parser");

const mongoUri =
  "mongodb+srv://user123:EHc0dB43WpqycSvE@cluster0.7lhwy.mongodb.net/manage?retryWrites=true&w=majority";

const dbConnect = () => {
  return mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
};

app.use(bodyParser.json());
app.use(express.json());
app.use(express.static("uploads"));
app.use(cors());

app.use(express.urlencoded({ extended: true }));
app.use("/", rootRout);
app.use("/auth", authRoute);
app.use("/client", clientRout);
app.use("/meeting", meetingRout);
app.use("/task", taskRout);
app.use("/content", contentRout);
app.use("/salse", salseRout);

dbConnect()
  .then((data) => {
    console.log("connected with mongodb");
    app.listen("8089", () => {
      console.log("express server started at 8089");
    });
  })
  .catch((err) => {
    console.log(err);
  });


  //secret key - ubLkXmhUp7oh4KnbCf0XE2KMjFI
  //api key - 743863682556275
  //cloud name - dhvgqn6nh