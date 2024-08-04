const REGEX = require("@constants/regex");
const { ERRORS: { INVALID_FIELD } } = require("@utils/messageUtil");
const { ERRORS: { BOTH_PASSWORDS_REQUIRED, INVALID_PASSWORD } } = require("@constants/messages");

const validatePasswordMiddleware = (req, res, next) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).send({ message: BOTH_PASSWORDS_REQUIRED });
  }

  const regex = new RegExp(REGEX.PASSWORD);

  if (!regex.test(req.body.newPassword)) {
    const message = INVALID_FIELD("New password", INVALID_PASSWORD)
    return res.status(400).send({ message });
  }

  return next();
};

module.exports = validatePasswordMiddleware;