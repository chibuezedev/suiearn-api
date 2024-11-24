const getErrorMessage = (err, defaultMessage) => {
  if (err instanceof Error) return err.message;
  return defaultMessage ?? "An error occured!";
};

module.exports = getErrorMessage;
