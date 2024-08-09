module.exports = {
  ERRORS: {
    NOT_FOUND: (field) => `${field} was not found`,
    INVALID_FIELD: (field, conditions) => `${field} is invalid, it must ${conditions}`,
    REQUIRED: (field) => `${field} is required`,
    NO_VALUE: (field) => `${field} can't be empty, undefined or null`,
    INVALID_TYPE: (field, type) => `${field} must be of type ${type.key}.`,
    UNACCEPTABLE: (field) => `field '${field}' is unacceptable!`,
  },
  SUCCESS: {
    UPDATED: (field) => `${field} was successfully updated`,
    CREATED: (data) => `${data} was sucessfully created`
  }
};