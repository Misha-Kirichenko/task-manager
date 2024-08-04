const bcrypt = require("bcrypt");
const { Op } = require("sequelize");
const { createHttpException, generateTokenPairs, MESSAGE_UTIL } = require("@utils");
const MESSAGES = require("@constants/messages");

module.exports = (Model) => ({
  async login(login, password) {

    if (!login || !password) {
      const badRequestException = createHttpException(400, MESSAGES.ERRORS.ALL_FIELDS_REQUIRED);
      throw badRequestException;
    }

    const foundUser = await Model.findOne({
      where: {
        ...(
          (Model.name === "user" && { email: login }) ||
          (Model.name === "admin" && { [Op.or]: { email: login, login } })
        )
      },
    });

    if (foundUser) {
      const passwordsMatch = await bcrypt.compare(password, foundUser.password);
      if (passwordsMatch) {
        const { id, role, email } = foundUser;
        const tokenPairs = generateTokenPairs({ id, login, ...(role ? { role } : email ? { role: "ADMIN" } : { role: "ROOT" }) });

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
    const notFoundException = createHttpException(404, MESSAGE_UTIL.ERRORS.NOT_FOUND(Model.name));
    throw notFoundException;
  }
})
