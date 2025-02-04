const Bounty = require("../models/bounty");
const mongoose = require("mongoose");

const createBounty = async (creator, bountyData) => {
  try {
    const { title, description, reward, startDate, endDate } = bountyData;
    if (!mongoose.Types.ObjectId.isValid(creator)) {
      throw new Error("Invalid creator ID");
    }
    if (startDate > endDate) {
      throw new Error("Start date cannot be after end date");
    }

    if (!title || !description || !reward || !startDate || !endDate) {
      throw new Error(
        "Title, description, Start Date, End Date, and reward are required"
      );
    }
    if (parseFloat(reward) <= 0) {
      throw new Error("Reward must be a positive number");
    }
    const bounty = new Bounty({
      title,
      description,
      reward,
      startDate,
      endDate,
      status: "OPEN",
      createdBy: creator,
    });
    await bounty.save();
    return bounty;
  } catch (error) {
    throw new Error(`Failed to create bounty: ${error.message}`);
  }
};

const updateBounty = async (bountyId, updateData) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(bountyId)) {
      throw new Error("Invalid bounty ID");
    }

    const bounty = await Bounty.findById(bountyId);
    if (!bounty) {
      throw new Error("Bounty not found");
    }

    if (updateData.startDate && updateData.endDate) {
      if (updateData.startDate > updateData.endDate) {
        throw new Error("Start date cannot be after end date");
      }
    }

    if (updateData.reward && parseFloat(updateData.reward) <= 0) {
      throw new Error("Reward must be a positive number");
    }

    const updatedBounty = await Bounty.findByIdAndUpdate(
      bountyId,
      { $set: updateData },
      { new: true }
    ).populate("createdBy", "username firstName lastName email");

    return updatedBounty;
  } catch (error) {
    throw new Error(`Failed to update bounty: ${error.message}`);
  }
};


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

    const bounties = await Bounty.find(query).populate(
      "createdBy", "username firstName lastName email"
    );
    return bounties;
  } catch (error) {
    throw new Error(`Failed to fetch bounties: ${error.message}`);
  }
};

const getBountyById = async (id) => {
  try {
    const bounty = await Bounty.findById(id).populate(
      "createdBy", "username firstName lastName email"
    );
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
  createBounty,
  updateBounty
};
