const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const songRoutes = require("./routes.js");

const app = express();

app.use(cors());

app.use(express.json());

app.use("/api/v1/", songRoutes);

const PORT = process.env.PORT || 8000;

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("Connected");
    app.listen(PORT, () => {
      console.log(`server listening in port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
