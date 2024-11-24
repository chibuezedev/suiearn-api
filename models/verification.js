const { Schema: _Schema, model } = require("mongoose");

const Schema = _Schema;

const verificationSchema = new Schema(
  {
    hashedUniqueString: {
      type: String,
    },
    userId: {
      type: _Schema.Types.ObjectId,
      ref: "User",
    },
    createdAt: { type: Date, default: Date.now },
    expiresAt: Date,
  },
  {
    timestamps: true,
  }
);

const verificationModel = model("Verification", verificationSchema);
module.exports = verificationModel;
