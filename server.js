require("dotenv").config();

const path = require("path");

const express = require("express");
var cors = require("cors");

const mongoose = require("mongoose");
const errorHandler = require("./middlewares/error");

const app = express();

app.use(cors());

app.use(express.json());

app.use(express.urlencoded({ extended: false }));

const db = process.env.MongoDB;

mongoose
  .connect(db, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("MongoDB Connected");
  })
  .catch((err) => {
    console.log(err);
  });

/*const httpServer = require("http").createServer();
const io = require("socket.io")(httpServer, {
  cors: { origin: "*", methods: ["GET", "POST"] }
});

httpServer.listen(4000);

io.on("connection", (socket) => {
  console.log((socket.id = "5555555"));
  io.sockets.to("5555555").emit("hello");
  console.log("sent");
});
app.set("io", io);*/

app.use(errorHandler);

app.use("/api", require("./api"));

if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

const port = process.env.PORT || 5007;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
