const AuthService = require("../services/auth");
const response = require("../helpers/response");

const signup = async (req, res) => {
  const payload = req.body;
  try {
    const user = await AuthService.signup(req, payload);
    return response(res, 201, "User Successfully Created!", user);
  } catch (error) {
    return response(res, 500, error.message);
  }
};

const login = async (req, res) => {
  const payload = req.body;
  try {
    const user = await AuthService.login(payload);
    return response(res, 200, "User logged in successfully!", user);
  } catch (error) {
    return response(res, 500, error.message);
  }
};

const changePassword = async (req, res) => {
  const payload = req.body;
  const userId = req.user.id;
  try {
    await AuthService.changePassword(userId, payload);
    return response(res, 200, "Password changed successfully!");
  } catch (error) {
    return response(res, 500, error.message);
  }
};

const verifyEmail = async (req, res) => {
  const { userId } = req.params;
  const { token } = req.query;
  if (!userId || !token) {
    return res.status(400).json({ message: "Missing user ID or token" });
  }
  try {
    if (!userId || !token) {
      return res.status(400).json({ message: "Missing user ID or token" });
    }

    const result = await AuthService.verifyEmail(userId, token);

    if (result.success) {
      return res.status(200).json(result);
    } else {
      return res.status(400).json(result);
    }
  } catch (error) {
    console.error("Email verification error:", error);
    return res.status(500).json({ message: error.message });
  }
};
const resendVerificationEmail = async (req, res) => {
  const userId = req.user.id;
  try {
    await AuthService.resendVerificationEmail(userId);
  } catch (error) {
    return response(res, 500, error.message);
  }
};

const requestPasswordReset = async (req, res) => {
  try {
    return await AuthService.requestPasswordReset(req.body);
  } catch (error) {
    return response(
      res,
      500,
      "Failed to send password reset request." || error.message
    );
  }
};

const resetPassword = async (req, res) => {
  try {
    const { token, userId } = req.query;
    const payload = req.body;
    return await AuthService.resetPassword(token, userId, payload);
  } catch (err) {
    return response(res, 500, err.message);
  }
};

module.exports = {
  signup,
  login,
  changePassword,
  verifyEmail,
  resendVerificationEmail,
  requestPasswordReset,
  resetPassword,
};
