require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const http = require("http");
const mongoose = require("mongoose");
const { Server } = require("socket.io");

const app = express();

const apiRoutes = require("./routes/api");
const userRoutes = require("./routes/user");

app.use(cors());
app.use(morgan("tiny"));
app.use(express.json());

mongoose.set("strictQuery", false);
mongoose.connect(process.env.DATABASE_URI).then(console.log("db connected"));
mongoose.Promise = global.Promise;

app.use("/api", apiRoutes);
app.use("/user", userRoutes);

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3001","http://localhost:3002"],
    methods: ["GET", "POST"],
  },
});

let users = [];
let boats = [];

const addUser = (userId,boatId, socketId) => {
  !users.some((user) => user.userId === userId) &&
    users.push({ userId,boatId, socketId });
};
const removeUser = (socketId) => {
  users = users.filter((user) => user.socketId !== socketId);
};
const getUser = (boatId) => {
  return users.filter((user) => user.boatId === boatId);
};

io.on("connection", (socket) => {
  //when ceonnect

  //take userId and socketId from user
  socket.on("addUser", (userId,boatId) => {
    addUser(userId,boatId, socket.id);
    console.log("added user")
  });

  //send and get message
  socket.on("sendData",({ boatId, Data }) => {
    const users1 =getUser(boatId);
    console.log("a data is been sent")
    console.log(users1)
    users1.map((user)=>{
       io.to(user.socketId).emit("getData",  Data);
    })
    
  });

  //when disconnect
  socket.on("disconnect", () => {
    console.log("a user disconnected!");
    removeUser(socket.id);
    io.emit("getUsers", users);
  });
});

const PORT = process.env.PORT || 4000;

server.listen(PORT, () => {
  console.log(`Server started on PORT : ${PORT}`);
});
