const bcrypt = require("bcrypt");
const crypto = require("crypto");
const passport = require("passport");

const User = require("../models/user");
const Verification = require("../models/verification");
const Token = require("../models/token");

const { sendEmail } = require("../helpers/sendEmail");
const { isValidId } = require("../helpers/isValidId");
const { generateAuthToken } = require("../helpers/authVerification");
const { sendVerificationEmail } = require("../helpers/sendVerificationEmail");
const config = require("../configs/env");

class HttpError extends Error {
  constructor(message, errorCode) {
    super(message);
    this.code = errorCode;
    this.name = "HttpError";
  }
}


const signup = async (req, payload) => {
  try {
    const { userName, email, password, firstName, lastName } = payload;
    if (!userName || !email || !password) {
      throw new HttpError("Credentials incomplete", 400);
    }

    if (await User.findOne({ email: email })) {
      throw new HttpError("Email already exists", 404);
    }

    if (await User.findOne({ userName: userName })) {
      throw new HttpError("User Name already exists, Please choose another one!", 400);
    }

    const user = await User.create({
      userName,
      email,
      password,
      firstName,
      lastName,
    });
    const { message, verificationToken } = await sendVerificationEmail(
      user._id
    );
    return {
      success: true,
      message: message,
      verificationToken: verificationToken,
    };
  } catch (error) {
    let user = await User.findOne({ email: req.body.email });
    if (user) {
      await Verification.findOneAndDelete({ userId: user._id });
      await User.findOneAndDelete({ _id: user._id });
    }
    if (error.code && typeof error.code === "number") {
      throw error;
    }
    throw new HttpError(
      error.message || "Failed to get Product, Try Again!",
      500
    );
  }
};

const login = async (payload) => {
  try {
    const { email, password } = payload;
    if (!email) {
      throw new HttpError("Email is required", 400);
    }

    if (!password) {
      throw new HttpError("Password is required", 400);
    }
    const user = await User.findOne({ email: email });
    if (!user) {
      throw new Error("User does not exist");
    }

    if (user.isVerified) {
      const validate = await user.isValidPassword(password);
      if (!validate) {
        throw new HttpError("Password is Incorrect", 400);
      }
      const token = generateAuthToken(user);
      return {
        success: true,
        message: "Login successful",
        user: {
          _id: user._id,
          email: user.email,
          userName: user.userName,
          isVerified: user.isVerified,
          accountType: user.accountType,
          role: user.role,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
        token: token,
      };
    } else {
      throw new HttpError("Email has not been verified, check your inbox", 400);
    }
  } catch (error) {
    if (error.code && typeof error.code === "number") {
      throw error;
    }
    throw new HttpError(
      error.message || "Failed to get Product, Try Again!",
      500
    );
  }
};

const changePassword = async (userId, payload) => {
  try {
    let user = await User.findById(userId);
    const { oldPassword, newPassword } = payload;

    if (!user) {
      throw new HttpError("User not found", 404);
    }
    const validate = await user.isValidPassword(oldPassword);
    if (!validate) {
      throw new HttpError("Old password is incorrect", 400);
    }
    if (newPassword) {
      user.password = newPassword;
      await user.save();
      return {
        success: true,
        message: "Password updated",
      };
    } else {
      throw new HttpError("New password not provided", 400);
    }
  } catch (error) {
    if (error.code && typeof error.code === "number") {
      throw error;
    }
    throw new HttpError(
      error.message || "Failed to get Product, Try Again!",
      500
    );
  }
};

const verifyEmail = async (userId, token) => {
  try {
    isValidId(userId);

    const verification = await Verification.findOne({ userId: userId });

    if (!verification) {
      return {
        success: false,
        message: "User not found or already verified",
      };
    }

    if (verification.expiresAt < Date.now()) {
      await Verification.findOneAndDelete({ userId: userId });
      return {
        success: false,
        message: "Verification link has expired",
      };
    }

    const compareString = await bcrypt.compare(
      token,
      verification.hashedUniqueString
    );

    if (compareString) {
      await Verification.findOneAndDelete({ userId: userId });

      await User.findByIdAndUpdate(userId, { isVerified: true }, { new: true });

      return {
        success: true,
        message: "User has been verified",
      };
    } else {
      return {
        success: false,
        message: "Invalid verification link",
      };
    }
  } catch (error) {
    console.error("Verification error:", error);
    if (error.code && typeof error.code === "number") {
      throw error;
    }
    throw new HttpError(
      error.message || "Verification failed, Try Again!",
      500
    );
  }
};

const resendVerificationEmail = async (userId) => {
  try {
    const { message, verificationToken } = await sendVerificationEmail(userId);
    return {
      success: true,
      message: message,
      userId: userId,
      verificationToken: verificationToken,
    };
  } catch (error) {
    if (error.code && typeof error.code === "number") {
      throw error;
    }
    throw new HttpError(
      error.message || "Verification failed, Try Again!",
      500
    );
  }
};

const requestPasswordReset = async (payload) => {
  const { email } = payload;
  const user = await User.findOne({ email });

  if (!user) {
    throw new HttpError("User not found", 404);
  }

  let token = await Token.findOne({ userId: user._id });
  if (token) await token.deleteOne();

  const resetToken = crypto.randomBytes(32).toString("hex");
  const passwordResetToken = await bcrypt.hash(resetToken, 10);

  await Token.create({
    userId: user._id,
    token: passwordResetToken,
    createdAt: Date.now(),
    expiresAt: Date.now() + 24 * (60 * 60 * 1000),
  });

  const link = `${config.auth.clientUrl}/passwordReset?token=${resetToken}&userId=${user._id}`;

  const emailPayload = {
    subject: "Password Reset Request",
    message: `<p>Hi ${user.userName},</p>
        <p>You requested to reset your password.</p>
        </br><p>This link <b>expires in 24 hours</b></p> </br>
        <p> Please, click the link below to reset your password</p>
        <a href="${link}">Reset Pass word</a>`,
  };

  const { email: userEmail } = user;
  await sendEmail(userEmail, emailPayload.subject, emailPayload.message);
  return {
    success: true,
    message: "Password reset email sent",
  };
};

const resetPassword = async (userId, token, payload) => {
  try {
    isValidId(userId);
    const { password } = payload;
    let passwordResetToken = await Token.findOne({ userId: userId });

    const user = await User.findOne({ _id: userId });

    if (!passwordResetToken) {
      throw new HttpError("Invalid or expired password reset token", 400);
    }

    if (passwordResetToken.expiresAt < Date.now()) {
      await passwordResetToken.deleteOne();

      throw new HttpError("Invalid or expired password reset token", 400);
    }

    const isValid = await bcrypt.compare(token, passwordResetToken.token);

    if (!isValid) {
      throw new HttpError("Invalid or expired password reset token", 400);
    }

    const hash = await bcrypt.hash(password, 10);

    await User.updateOne(
      { _id: userId },
      { $set: { password: hash } },
      { new: true }
    );

    await passwordResetToken.deleteOne();
    const EmailPayload = {
      subject: "Password Reset Successfully",
      message: `<p>Hello ${user.userName},</p>
            <p>Your password has been changed successfully</p>`,
    };

    await sendEmail(user.email, EmailPayload.subject, EmailPayload.message);
    return {
      success: true,
      message: "Password updated successfully",
    };
  } catch (error) {
    if (error.code && typeof error.code === "number") {
      throw error;
    }
    throw new HttpError(
      error.message || "Reset failed, Try Again!",
      500
    );
  }
};

const googleLogin = async (req, res, next) => {
  passport.authenticate("google", { scope: ["profile", "email"] })(
    req,
    res,
    next
  );
};

const googleCallback = (req, res, next) => {
  passport.authenticate("google", (err, data) => {
    if (err) {
      console.error("Google Error:", err);
      const redirectUrl = `${
        process.env.FRONTEND_URL
      }/google-callback?error=${encodeURIComponent(
        "An error occurred during authentication"
      )}`;
      return res.redirect(redirectUrl);
    }

    if (!data) {
      console.log("Authentication failed");
      const redirectUrl = `${
        process.env.FRONTEND_URL
      }/google-callback?error=${encodeURIComponent("Authentication failed")}`;
      return res.redirect(redirectUrl);
    }

    const redirectUrl = `${
      process.env.FRONTEND_URL
    }/google-callback?user=${encodeURIComponent(
      JSON.stringify(data.user)
    )}&token=${encodeURIComponent(data.token)}`;
    res.redirect(redirectUrl);
  })(req, res, next);
};

module.exports = {
  signup,
  login,
  changePassword,
  verifyEmail,
  sendVerificationEmail,
  resendVerificationEmail,
  requestPasswordReset,
  resetPassword,
  googleLogin,
  googleCallback,
};
