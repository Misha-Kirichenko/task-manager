module.exports = {
  ERRORS: {
    NOT_FOUND: (field) => `${field} was not found`,
    INVALID_FIELD: (field, conditions) => `${field} is invalid, it must ${conditions}`
  },
  SUCCESS: {
    UPDATED: (field) => `${field} was successfully updated`,
  }
};