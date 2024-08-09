const changeUserRoleMiddleware = require("./changeUserRoleMiddleware");
const validatePasswordMiddleware = require("./validatePasswordMiddleware");
const abstractUpdateMiddleware = require('./abstractUpdateMiddleware');
const abstractCreateMiddleware = require('./abstractCreateMiddleware');

module.exports = {
  changeUserRoleMiddleware,
  validatePasswordMiddleware,
  abstractUpdateMiddleware,
  abstractCreateMiddleware
};