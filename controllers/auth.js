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
  try {
    return await AuthService.verifyEmail(userId, token);
  } catch (error) {
    return response(res, 500, error.message);
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
    return await AuthService.resetPassword(token, userId);
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
