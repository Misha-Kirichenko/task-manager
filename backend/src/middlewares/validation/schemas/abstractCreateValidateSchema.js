const { ERRORS } = require("@constants/messages");
const { validateWithModelFields, MESSAGE_UTIL } = require("@utils");

const abstractCreateValidateSchema = (Model) => (req, res, next) => {
  try {
    const { body } = req;
    const errors = {};

    const { rawAttributes: modelAttributes } = Model;
    delete modelAttributes.id;

    for (const field in body) {
      if (!modelAttributes[field]) {
        return res.status(400).send({ message: MESSAGE_UTIL.ERRORS.UNACCEPTABLE(field) });
      }
    }

    for (const field in modelAttributes) {
      const { type, allowNull } = modelAttributes[field];

      if (!modelAttributes[field].hasOwnProperty("defaultValue") && !allowNull) {
        if (!body.hasOwnProperty(field)) {
          errors[field] = [MESSAGE_UTIL.ERRORS.REQUIRED(field)];
        }
        else if (!body[field]) {
          errors[field] = [MESSAGE_UTIL.ERRORS.NO_VALUE(field)];
        }
        else if (!validateWithModelFields(body[field], type)) {
          errors[field] = [MESSAGE_UTIL.ERRORS.INVALID_TYPE(field, type)];
        }
      }
      else {
        if (body.hasOwnProperty(field) && !validateWithModelFields(body[field], type)) {
          errors[field] = [MESSAGE_UTIL.ERRORS.INVALID_TYPE(field, type)];
        }
      }
    }

    req.errors = errors;

    return next();
  } catch (err) {
    return res.status(500).json({ message: ERRORS.INTERNAL_SERVER_ERROR });
  }

};

module.exports = abstractCreateValidateSchema;