const getErrorMessage = require("./getErrorMessage");
const HttpError = require("./httpError");
const response = require("./response");

const errorResponse = (res, err, customCode = undefined) => {
  const statusCode =
    err instanceof HttpError ? err.statusCode : customCode ?? 500;
  return response(res, statusCode, getErrorMessage(err));
};

module.exports = errorResponse;
