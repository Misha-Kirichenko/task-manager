const MESSAGES = require("@constants/messages");

const statusCodeMessage = (error, defaultStatus = 400, defaultMessage = MESSAGES.ERRORS.BAD_REQUEST) => {
  let status = defaultStatus;
  let message = defaultMessage;

  if (error.status) {
    message = error.message;
    status = error.status;
  }

  return { status, message };
};

module.exports = statusCodeMessage;