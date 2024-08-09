const MESSAGES = require("@constants/messages");

const checkRolesMiddleware = (roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return res.status(403).send({ message: MESSAGES.ERRORS.FORBIDDEN })
  }
  return next();
};

module.exports = checkRolesMiddleware;