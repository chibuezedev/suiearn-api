const express = require("express");
const userController = require("../controllers/user");

const router = express.Router();

router.put("/update", userController.updateProfile);

module.exports = router;
