const REGEX = require("@constants/regex");
const { ERRORS } = require("@constants/messages");
const { ERRORS: { INVALID_FIELD } } = require("@utils/messageUtil");

const abstractCreateMiddleware = (req, res, next) => {
  const { body, errors } = req;

  for (const field in body) {
    const UField = field.toUpperCase();
    const regex = new RegExp(REGEX[UField]);

    if (body[field] && !regex.test(body[field])) {
      const message = INVALID_FIELD(field, ERRORS[`INVALID_${UField}`]);
      if (errors[field]) {
        errors[field].push(message);
      }
      else {
        errors[field] = [message];
      }
    }
  }

  if (Object.keys(errors).length) {
    return res.status(400).send({
      message: errors
    });
  }

  delete req.errors;
  return next();
};

module.exports = abstractCreateMiddleware;