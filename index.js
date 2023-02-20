require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const mongoose = require("mongoose");

const app = express();

const apiRoutes = require("./routes/api");
const userRoutes = require("./routes/user")

app.use(cors());
app.use(morgan("tiny"));
app.use(express.json());

mongoose.set("strictQuery", false);
mongoose.connect(process.env.DATABASE_URI).then(console.log("db connected"));
mongoose.Promise = global.Promise;

app.use("/api", apiRoutes);
app.use("/user", userRoutes);


const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server started on PORT : ${PORT}`);
});
