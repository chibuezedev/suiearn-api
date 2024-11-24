const express = require("express");

const authRouter = require("./auth");

const app = express();

app.get("/api/v1", (req, res) => {
  res.status(200).json({
    message: "WELCOME TO SUIEARN API",
  });
});

app.use("/api/v1/auth", authRouter);

module.exports = app;
