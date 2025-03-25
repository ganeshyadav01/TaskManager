require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");

const userAuthRoute = require("./routes/userAuthRoute");
const taskRoute = require("./routes/taskRoute");
const userProfile = require("./routes/userProfileRoute")

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json()); 
app.use(bodyParser.json());

app.use("/api/auth", userAuthRoute);
app.use("/api/tasks", taskRoute);
app.use("/api", userProfile)

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB is connected successfully...."))
  .catch(err => console.log(err));

app.listen(PORT, () => console.log(`Server is running on port ${PORT}....`))