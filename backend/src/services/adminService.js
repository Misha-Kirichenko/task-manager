const conn = require('@config/conn');
const User = require('@models/User')(conn);
const createHttpException = require("@utils/createHttpException");
const MESSAGES = require("@constants/messages");
const { USER_ROLES } = require("@constants/roles");

exports.changeUserRole = async (id, role) => {

  if (!USER_ROLES.includes(role)) {
    const badRequestException = createHttpException(400, MESSAGES.ERRORS.INVALID_ROLE);
    throw badRequestException;
  }

  const foundUser = await User.findByPk(id, {
    attributes: ['id', 'role']
  });

  if (!foundUser) {
    const notFoundException = createHttpException(404, MESSAGES.ERRORS.USER_NOT_FOUND);
    throw notFoundException;
  }

  foundUser.role = role;
  await foundUser.save();

  return { message: MESSAGES.SUCCESS.ROLE_CHANGED };
}