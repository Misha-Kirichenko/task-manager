const bcrypt = require("bcrypt");
const { Op } = require("sequelize");
const createHttpException = require("@utils/createHttpException");
const generateTokenPairs = require("@utils/securityUtils");
const MESSAGES = require("@constants/messages");

module.exports = (Model) => ({
  async login(login, password) {
    let foundUser;
    if (!login || !password) {
      const badRequestException = createHttpException(400, MESSAGES.ERRORS.ALL_FIELDS_REQUIRED);
      throw badRequestException;
    }

    if (Model.name === "user") {
      foundUser = await Model.findOne({
        where: {
          email: login
        },
      });
    } else if (Model.name === "admin") {
      foundUser = await Model.findOne({
        where: {
          [Op.or]: {
            email: login,
            login
          }
        },
      });
    }

    if (foundUser) {
      const passwordsMatch = await bcrypt.compare(password, foundUser.password);
      if (passwordsMatch) {
        const { id, role } = foundUser;
        const tokenPairs = generateTokenPairs({ id, login, ...(role && { role }) });

        //check on undefined because lastLogin can be 0
        if (foundUser.lastLogin !== undefined) {
          foundUser.lastLogin = Date.now();
        }

        await foundUser.save();
        return tokenPairs;
      }

      const unauthorizedException = createHttpException(401, MESSAGES.ERRORS.UNAUTHORIZED);
      throw unauthorizedException;
    }
    const notFoundException = createHttpException(404, MESSAGES.ERRORS.USER_NOT_FOUND);
    throw notFoundException;
  }
})
