const { ERRORS } = require("@constants/messages");
const { validateWithModelFields, MESSAGE_UTIL } = require("@utils");

const abstractCreateValidateSchema = (Model, excludeFields = []) => (req, res, next) => {
  try {
    const errors = {};

    const { rawAttributes: modelAttributes } = Model;
    delete modelAttributes.id;

    const passedFieldsCopy = {...req.body};

    if(excludeFields.length){
      for(const field of excludeFields){
        delete passedFieldsCopy[field];
        delete modelAttributes[field];
      }
    }

    for (const field in passedFieldsCopy) {
      if (!modelAttributes[field]) {
        return res.status(400).send({ message: MESSAGE_UTIL.ERRORS.UNACCEPTABLE(field) });
      }
    }

    for (const field in modelAttributes) {
      const { type, allowNull } = modelAttributes[field];
      
      if (!modelAttributes[field].hasOwnProperty("defaultValue") && !allowNull) {
        if (!passedFieldsCopy.hasOwnProperty(field)) {
          errors[field] = [MESSAGE_UTIL.ERRORS.REQUIRED(field)];
        } else if (!passedFieldsCopy[field]) {
          errors[field] = [MESSAGE_UTIL.ERRORS.NO_VALUE(field)];
        } else if (!validateWithModelFields(passedFieldsCopy[field], type)) {
          errors[field] = [MESSAGE_UTIL.ERRORS.INVALID_TYPE(field, type)];
        }
      } else {
        if (passedFieldsCopy.hasOwnProperty(field) && !validateWithModelFields(passedFieldsCopy[field], type)) {
          errors[field] = [MESSAGE_UTIL.ERRORS.INVALID_TYPE(field, type)];
        }
      }
    }

    req.errors = errors;

    return next();
  } catch (error) {
    return res.status(500).json({ message: ERRORS.INTERNAL_SERVER_ERROR });
  }

};

module.exports = abstractCreateValidateSchema;