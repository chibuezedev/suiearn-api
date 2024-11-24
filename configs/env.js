require("dotenv").config();

const config = {
  mongodb: {
    url: process.env.MONGODB_URI,
  },
  sendgrid: {
    apiKey: process.env.SENDGRID_API_KEY,
    senderEmail: process.env.SENDGRID_SENDER_EMAIL,
  },
  auth: {
    jwtSecret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN,
    clientUrl: process.env.CLIENT_URL,
    googleAuthId: process.env.GOODLE_AUTH_CLIENT_ID,
    googleSecret: process.env.GOOGLE_CLIENT_SECRET
  }
};

module.exports = config;
