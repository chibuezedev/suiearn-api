const userServices = require("../services/user");
const response = require("../helpers/response");

const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const profileData = req.body;

    const updatedProfile = await userServices.updateProfile(
      userId,
      profileData
    );

    return response(res, 200, "Profile updated successfully", updatedProfile);
  } catch (error) {
    return response(res, 500, "Failed to update profile", error.message);
  }
};

module.exports = {
  updateProfile,
};
