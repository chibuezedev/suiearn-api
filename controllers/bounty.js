const BountyService = require("../services/bounty");
const response = require("../helpers/response");

const createBounty = async (req, res) => {
  const bountyData = req.body;
  const creator = req.user.id;
  try {
    const bounty = await BountyService.createBounty(creator, bountyData);
    return response(res, 201, "Bounty Successfully Created!!", bounty);
  } catch (error) {
    return response(res, 500, "Failed to create bounty", error.message);
  }
};

const updateBounty = async (req, res) => {
  const bountyId = req.params.id;
  const updatedData = req.body;

  try {
    const updatedBounty = await BountyService.updateBounty(
      bountyId,
      updatedData
    );
    return response(res, 200, "Bounty successfully updated!!", updatedBounty);
  } catch (error) {
    return response(res, 500, "Failed to update bounty", error.message);
  }
};
const getAllBounties = async (req, res) => {
  try {
    const bounties = await BountyService.getAllBounties();
    return response(res, 200, "Bounties Successfully Retrieved!!", bounties);
  } catch (error) {
    return response(
      res,
      500,
      "An error occurred while retrieving bounties.",
      error.message
    );
  }
};

const submitBountyAnswer = async (req, res) => {
  const bountyId = req.params.id;
  const userId = req.user.id;

  try {
    const bounty = await BountyService.submitBountyAnswer(
      bountyId,
      userId,
      req.body
    );
    return response(res, 200, "Bounty answer submitted successfully", bounty);
  } catch (error) {
    return response(res, 500, "Failed to submit bounty answer", error.message);
  }
};

const getBountyById = async (req, res) => {
  const bountyId = req.params.id;
  try {
    const bounty = await BountyService.getBountyById(bountyId);
    return response(res, 200, "Bounty successfully retrieved!!", bounty);
  } catch (error) {
    return response(
      res,
      500,
      "An error occurred while retrieving bounty.",
      error.message
    );
  }
};

module.exports = {
  getAllBounties,
  submitBountyAnswer,
  getBountyById,
  createBounty,
  updateBounty,
};
