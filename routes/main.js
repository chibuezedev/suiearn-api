const express = require("express");

const authRoutes = require("./auth");
const bountyRoutes = require("./bounty");
const userRoutes = require("./user");

const app = express();

app.get("/api/v1", (req, res) => {
  res.status(200).json({
    message: "WELCOME TO SUIEARN API",
  });
});

app.use("/auth", authRoutes);
app.use("/bounty", bountyRoutes);
app.use("/user", userRoutes);

module.exports = app;
