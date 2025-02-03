const express = require("express");
const router = express.Router();
const passport = require("passport");
const initGooglePassport = require("../utils/google");
initGooglePassport();
const {
  signup,
  login,
  changePassword,
  requestPasswordReset,
  resetPassword,
  verifyEmail,
} = require("../controllers/auth");
const { googleLogin, googleCallback } = require("../services/auth");

const { checkUser } = require("../middlewares/user-validation");
const { Auth } = require("../middlewares/auth");

router.post("/signup", checkUser, signup);
router.get("/verify-email/:userId", verifyEmail);
router.post("/login", login);

router.post("/request-reset-password", requestPasswordReset);
router.post("/passwordReset", resetPassword);
router.get("/google", googleLogin);
router.get("/google/callback", googleCallback);

router.use(Auth());

router.post("/change-password", changePassword);

module.exports = router;
