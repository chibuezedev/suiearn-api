const { Types } = require("mongoose");

const isValidId = function (id) {
  const isValid = Types.ObjectId.isValid(id);
  if (!isValid) {
    throw Error("id is not valid");
  }
  return;
};

module.exports = { isValidId };
