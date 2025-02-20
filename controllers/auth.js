const AuthService = require("../services/auth");
const response = require("../helpers/response");

const signup = async (req, res) => {
  const payload = req.body;
  try {
    const user = await AuthService.signup(req, payload);
    return response(res, 201, "User Successfully Created!", user);
  } catch (error) {
    if (error.code && typeof error.code === 'number') {
      return response(res, error.code, error.message, null);
    }
    return response(res, 500, error.message || "Internal server error", null);
  }
};

const login = async (req, res) => {
  const payload = req.body;
  try {
    const user = await AuthService.login(payload);
    return response(res, 200, "User logged in successfully!", user);
  } catch (error) {
    if (error.code && typeof error.code === 'number') {
      return response(res, error.code, error.message, null);
    }
    return response(res, 500, error.message || "Internal server error", null);
  }
};

const changePassword = async (req, res) => {
  const payload = req.body;
  const userId = req.user.id;
  try {
    await AuthService.changePassword(userId, payload);
    return response(res, 200, "Password changed successfully!");
  } catch (error) {
    if (error.code && typeof error.code === 'number') {
      return response(res, error.code, error.message, null);
    }
    return response(res, 500, error.message || "Internal server error", null);
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
    if (error.code && typeof error.code === 'number') {
      return response(res, error.code, error.message, null);
    }
    return response(res, 500, error.message || "Internal server error", null);
  }
};
const resendVerificationEmail = async (req, res) => {
  const userId = req.user.id;
  try {
    const result = await AuthService.resendVerificationEmail(userId);
    return response(res, 200, result.message, result);
  } catch (error) {
    if (error.code && typeof error.code === 'number') {
      return response(res, error.code, error.message, null);
    }
    return response(res, 500, error.message || "Internal server error", null);
  }
};

const requestPasswordReset = async (req, res) => {
  try {
    const result = await AuthService.requestPasswordReset(req.body);
    return response(res, 200, "Password reset request sent successfully!", result);
  } catch (error) {
    if (error.code && typeof error.code === 'number') {
      return response(res, error.code, error.message, null);
    }
    return response(res, 500, error.message || "Internal server error", null);
  }
};

const resetPassword = async (req, res) => {
  try {
    const { token, userId } = req.query;
    const payload = req.body;
    const result = await AuthService.resetPassword(userId, token, payload);
    return response(res, 200, result.message, result);
  } catch (err) {
    if (error.code && typeof error.code === 'number') {
      return response(res, error.code, error.message, null);
    }
    return response(res, 500, error.message || "Internal server error", null);
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
