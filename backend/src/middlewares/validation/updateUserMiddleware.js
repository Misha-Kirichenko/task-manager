const REGEX = require("@constants/regex");
const { ERRORS } = require("@constants/messages");
const { ERRORS: { INVALID_FIELD, UPDATE_FIELDS } } = require("@utils/messageUtil");

const updateUserMiddleware = (req, res, next) => {
  const { body } = req;
  const fieldsValues = Object.values(body);

  if (fieldsValues.some(fieldValue => Boolean(fieldValue))) {

    const errors = [];

    for (const field in body) {
      const UField = field.toUpperCase();
      const regex = new RegExp(REGEX[UField]);

      if (body[field] && !regex.test(body[field])) {
        const message = INVALID_FIELD(field, ERRORS[`INVALID_${UField}`]);
        errors.push(message);
      }
    }

    if (errors.length) {
      return res.status(400).send({ message: errors });
    }

    return next();
  }

  return res.status(400).send({ messages: ERRORS.UPDATE_FIELDS });

};

module.exports = updateUserMiddleware;