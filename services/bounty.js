const Bounty = require("../models/bounty");

const getAllBounties = async (filters = {}) => {
  try {
    const query = {};

    if (filters.title) {
      query.title = { $regex: filters.title, $options: "i" };
    }
    if (filters.status) {
      query.status = filters.status;
    }
    if (filters.createdBy) {
      query.createdBy = filters.createdBy;
    }
    if (filters.minReward) {
      query.reward = { $gte: parseFloat(filters.minReward) };
    }

    const bounties = await Bounty.find(query);
    return bounties;
  } catch (error) {
    throw new Error(`Failed to fetch bounties: ${error.message}`);
  }
};

const getBountyById = async (id) => {
  try {
    const bounty = await Bounty.findById(id);
    if (!bounty) {
      throw new Error("Bounty not found");
    }
    return bounty;
  } catch (error) {
    throw new Error(`Failed to fetch bounty: ${error.message}`);
  }
};

const submitBountyAnswer = async (bountyId, userId, answerDetails) => {
  try {
    const bounty = await Bounty.findById(bountyId);
    if (!bounty) {
      throw new Error("Bounty not found");
    }

    bounty.status = "IN_PROGRESS";
    await bounty.save();

    return {
      message: "Bounty answer submitted successfully",
      bountyId,
      userId,
      answerDetails,
    };
  } catch (error) {
    throw new Error(`Failed to submit bounty answer: ${error.message}`);
  }
};

module.exports = {
  getAllBounties,
  getBountyById,
  submitBountyAnswer,
};
