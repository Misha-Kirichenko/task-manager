const REGEX = require("@constants/regex");
const MESSAGES = require("@constants/messages");

const validatePassword = (req, res, next) => {
  const regex = new RegExp(REGEX.PASSWORD);
  if (!regex.test(req.body.newPassword)) {
    return res.status(400).send({ message: MESSAGES.ERRORS.INVALID_PASSWORD });
  }
  return next();
};

module.exports = validatePassword;