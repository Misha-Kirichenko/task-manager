const bcrypt = require("bcrypt");
const conn = require("@config/conn");
const User = require("@models/User")(conn);
const createHttpException = require("@utils/createHttpException");
const generateTokenPairs = require("@utils/securityUtils");
const MESSAGES = require("@constants/messages");

exports.login = async (login, password) => {

  if (!login || !password) {
    const badRequestException = createHttpException(400, MESSAGES.ERRORS.ALL_FIELDS_REQUIRED);
    throw badRequestException;
  }

  const foundUser = await User.findOne({
    where: { email: login },
    attributes: ['id', 'role', 'email', "password"]
  });

  if (foundUser) {
    const passwordsMatch = await bcrypt.compare(password, foundUser.password);
    if (passwordsMatch) {
      const { id, email: login, role } = foundUser;
      const tokenPairs = generateTokenPairs({ id, login, role });
      foundUser.lastLogin = Date.now();
      await foundUser.save();
      return tokenPairs;
    }

    const unauthorizedException = createHttpException(401, MESSAGES.ERRORS.UNAUTHORIZED);
    throw unauthorizedException;
  }
  const notFoundException = createHttpException(404, MESSAGES.ERRORS.USER_NOT_FOUND);
  throw notFoundException;
}