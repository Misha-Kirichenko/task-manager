const { ERRORS } = require("@constants/messages");
const { validateWithModelFields, MESSAGE_UTIL } = require("@utils");

const abstractUpdateValidateSchema = (Model, excludeFields = []) => (req, res, next) => {
  try {
    const { body } = req;
    const errors = {};

    const { rawAttributes: modelAttributes } = Model;

    if(excludeFields.length){
      for(const field of excludeFields){
        delete req.body[field];
      }
    }

    for (const field in body) {
      if (!modelAttributes[field]) {
        return res.status(400).send({ message: ERRORS.UNACCEPTABLE(field) });
      }

      const { type, allowNull } = modelAttributes[field];

      if (body.hasOwnProperty(field) && !body[field] && !allowNull) {
        errors[field] = [MESSAGE_UTIL.ERRORS.NO_VALUE(field)];
      }
      else if (!validateWithModelFields(body[field], type)) {
        errors[field] = [MESSAGE_UTIL.ERRORS.INVALID_TYPE(field)];
      }
    }

    req.errors = errors;

    return next();
  } catch (err) {
    return res.status(500).json({ message: ERRORS.INTERNAL_SERVER_ERROR });
  }

};

module.exports = abstractUpdateValidateSchema;