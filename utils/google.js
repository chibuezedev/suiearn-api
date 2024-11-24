const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

const { generateAuthToken } = require("../helpers/authVerification");
const User = require("../models/user");
const config = require("../configs/env");

// Passport setup
const initGooglePassport = () => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: config.auth.googleAuthId,
        clientSecret: config.auth.googleAuthSecret,
        callbackURL: "/api/v1/auth/google/callback",
        scope: ["profile", "email"],
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const userEmail = profile.emails[0].value;
          const userName = profile.displayName;

          let user = await User.findOne({ email: userEmail });

          if (!user) {
            user = await User.create({
              userName: userName,
              email: userEmail,
              googleId: profile.id,
              password: "GOOGLE_USER",
              isVerified: true,
            });

            await user.save();
          }

          const token = generateAuthToken(user);

          done(null, {
            token: token,
            user: {
              _id: user._id,
              email: user.email,
              userName: user.userName,
              isVerified: user.isVerified,
              createdAt: user.createdAt,
              updatedAt: user.updatedAt,
            },
          });
        } catch (error) {
          done(error);
        }
      }
    )
  );
};

module.exports = initGooglePassport;
