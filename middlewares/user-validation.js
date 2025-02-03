const User = require("../models/user");
const HttpError = require("../helpers/HttpError");

const checkUser = async (req, res, next) => {
  try {
    const email = await User.findOne({
      email: req.body.email,
    });

    if (email) {
      throw new Error(403, "Email already registered");
    }

    next();
  } catch (error) {
    throw new Error(500, error.message);
  }
};

module.exports = {
  checkUser,
};
