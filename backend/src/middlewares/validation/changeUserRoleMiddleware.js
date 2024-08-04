const { ERRORS: { INVALID_ROLE, NO_ROLE } } = require("@constants/messages");
const { USER_ROLES } = require("@constants/roles");

const changeUserRoleMiddleware = (req, res, next) => {

  if (!req.body.role) {
    return res.status(400).send({ message: NO_ROLE })
  }

  if (!USER_ROLES.includes(req.body.role)) {
    return res.status(400).send({ message: INVALID_ROLE })
  }

  return next();
};

module.exports = changeUserRoleMiddleware;