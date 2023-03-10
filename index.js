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
    origin: '*',
    methods: '*',
  },
});

let users = [];
let boats = [];
app.set('io',io);
app.set('users',users);


const addUser = (userId, boatId, socketId) => {
  !users.some((user) => user.userId === userId) &&
    users.push({ userId, boatId, socketId });
};
const removeUser = (socketId) => {
  users = users.filter((user) => user.socketId !== socketId);
};
const getUser = (boatId) => {
  return users.filter((user) => user.boatId === boatId);
};
app.set("getUser", getUser);
io.on("connection", (socket) => {
  //when ceonnect
  console.log("user Connected")

  //take userId and socketId from user
  socket.on("addUser", (Id) => {
    addUser(Id.userId, Id.boatId, socket.id);
  });

  //send and get message
  // socket.on("sendData", ({ boatId},{Temp},{Tds},{Turb}) => {
  //   console.log("user send data")
  //   console.log(Temp)
    
  //   const Data = {
  //     temp: Temp,
  //     tds: Tds,
  //     turbidity : Turb,
  //   }
  //   const users1 = getUser(boatId);
  //   users1.map((user) => {
  //     io.to(user.socketId).emit("getData",Data);
  //   });
  // });

  //when disconnect
  socket.on("disconnect", () => {
    removeUser(socket.id);
  });
});

const PORT = process.env.PORT || 4000;
console.log(PORT)
server.listen(PORT, () => {
  console.log(`Server started on PORT : ${PORT}`);
});
