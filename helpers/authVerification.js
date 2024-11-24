const jwt = require("jsonwebtoken");
const config = require("../configs/env");

const { sign, verify } = jwt;

const generateAuthToken = function (user) {
  const token = sign(
    {
      id: user._id,
      email: user.email,
    },
    config.auth.jwtSecret,
    { expiresIn: config.auth.expiresIn }
  );
  return token;
};

const verifyToken = (req, res, next) => {
  const authorization = req.header("Authorization");
  if (!authorization) {
    return res.status(403).json({
      succes: false,
      message: "Token required",
    });
  }

  let [tokenType, token] = authorization.split(" ");
  if (tokenType !== "Bearer") {
    return res.status(403).json({
      succes: false,
      message: "Bearer Token required",
    });
  }
  try {
    const decoded = verify(token, config.auth.jwtSecret);
    req.user = decoded;
  } catch (error) {
    return res.status(401).json({
      succes: false,
      message: error.message,
    });
  }
  next();
};
module.exports = { verifyToken, generateAuthToken };
