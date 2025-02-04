const mongoose = require("mongoose");

const SubmissionSchema = new mongoose.Schema(
  {
    bounty: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Bounty",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    solution: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Submission", SubmissionSchema);
