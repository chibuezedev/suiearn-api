const express = require("express");

const authRoutes = require("./auth");
const bountyRoutes = require("./bounty");
const userRoutes = require("./user");

const app = express();

app.use("/auth", authRoutes);
app.use("/bounty", bountyRoutes);
app.use("/user", userRoutes);

module.exports = app;
