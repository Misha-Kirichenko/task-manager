const bcrypt = require("bcrypt");
const conn = require('@config/conn');
const User = require('@models/User')(conn);
const { MESSAGE_UTIL, createHttpException } = require("@utils");
const MESSAGES = require("@constants/messages");


exports.changeUserRole = async (id, role) => {

  const foundUser = await User.findByPk(id, {
    attributes: ['id', 'role']
  });

  if (!foundUser) {
    const notFoundException = createHttpException(404, MESSAGE_UTIL.ERRORS.NOT_FOUND("User"));
    throw notFoundException;
  }

  foundUser.role = role;
  await foundUser.save();

  return { message: MESSAGES.SUCCESS.ROLE_CHANGED };
}

exports.updateUser = async (id, body) => {

  const foundUser = await User.findByPk(id, {
    attributes: ['id']
  });

  if (!foundUser) {
    const notFoundException = createHttpException(404, MESSAGE_UTIL.ERRORS.NOT_FOUND("User"));
    throw notFoundException;
  }

  if (body.password) {
    const { password } = body;
    delete body.password;
    const hashedPassword = await bcrypt.hash(password, parseInt(process.env.PASSWORD_SALT_ROUNDS));
    foundUser.password = hashedPassword;
  }

  for (const field in body) {
    foundUser[field] = body[field];
  }

  await foundUser.save();

  return { message: MESSAGE_UTIL.SUCCESS.UPDATED("User's data") };
}