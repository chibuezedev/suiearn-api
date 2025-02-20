const mongoose = require("mongoose");

const BountySchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    reward: {
      first: { type: Number, required: true },
      second: { type: String, required: true },
      third: { type: String, required: true },
    },
    about: { type: String, required: true },
    eligibility: { type: String, required: true },
    requirements: { type: String, required: true },
    procedure: { type: String, required: true },
    status: {
      type: String,
      enum: ["OPEN", "IN_PROGRESS", "COMPLETED"],
      default: "OPEN",
    },
    comments: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
      default: [],
    },
    submissions: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Submission" }],
      default: [],
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    thumbnail: {
      type: String,
      default: null,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    data: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Bounty", BountySchema);
