const { ERRORS } = require("@constants/messages");
const { validateWithModelFields } = require("@utils");

const abstractUpdateValidateSchema = (Model) => (req, res, next) => {
  try {
    const { body } = req;
    const errors = {};

    const { rawAttributes: modelAttributes } = Model;

    for (const field in body) {
      if (!modelAttributes[field]) {
        return res.status(400).send({ message: `field '${field}' is unacceptable!` });
      }

      const { type, allowNull } = modelAttributes[field];

      if (body.hasOwnProperty(field) && !body[field] && !allowNull) {
        errors[field] = [`${field} can't be empty, undefined or null`];
      }
      else if (!validateWithModelFields(body[field], type)) {
        errors[field] = [`${field} must be of type ${type.key}.`];
      }
    }

    req.errors = errors;

    return next();
  } catch (err) {
    return res.status(500).json({ message: ERRORS.INTERNAL_SERVER_ERROR });
  }

};

module.exports = abstractUpdateValidateSchema;