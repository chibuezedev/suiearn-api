const User = require("../models/user");

const updateProfile = async (userId, profileData) => {
  return await User.findByIdAndUpdate(userId, profileData, {
    new: true,
    runValidators: true,
  });
};

const getProfile = async (userId) => {
  return await User.findById(userId, { password: 0 });
};


module.exports = {
  updateProfile,
  getProfile
};
