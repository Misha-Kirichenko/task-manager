const conn = require("@config/conn");
const User = require("@models/User")(conn);
const createHttpException = require("@utils/createHttpException");
const MESSAGES = require("@constants/messages");


exports.getProfile = async (id) => {
  const foundUser = await User.findByPk(id);
  if (!foundUser) {
    const notFoundException = createHttpException(404, MESSAGES.ERRORS.USER_NOT_FOUND);
    throw notFoundException;
  }
  return foundUser;
}