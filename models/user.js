const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    userName: {
      type: String,
      required: true,
      unique: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    googleId: {
      type: String,
    },
    provider: {
      type: String,
      required: false,
    },
    isOnboarded: {
      type: Boolean,
      default: false,
    },
    accountType: {
      type: String,
      enum: ["subscriber", "admin"],
      default: "subscriber",
    },
    wallet: {
      type: String,
    },
    role: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Role",
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  const user = this;
  const hash = await bcrypt.hash(this.password, 10);

  this.password = hash;
  next();
});

userSchema.methods.isValidPassword = async function (password) {
  const user = this;
  const compare = await bcrypt.compare(password, user.password);

  return compare;
};

const userModel = mongoose.model("User", userSchema);
module.exports = userModel;
