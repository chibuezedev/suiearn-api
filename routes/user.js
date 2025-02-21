const express = require("express");
const userController = require("../controllers/user");
const { Auth } = require("../middlewares/auth");

const router = express.Router();

router.use(Auth(["admin", "subscriber"]));

router.put("/update", userController.updateProfile);
router.get("/profile", userController.getProfile);

module.exports = router;
