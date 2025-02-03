const User = require("../models/user");

const updateProfile = async (userId, profileData) => {
  return await User.findByIdAndUpdate(userId, profileData, {
    new: true,
    runValidators: true,
  });
};

module.exports = {
  updateProfile,
};
