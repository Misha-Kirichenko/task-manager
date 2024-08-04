const bcrypt = require("bcrypt");
const { Op } = require("sequelize");
const { USER_ROLES, ADMIN_ROLES } = require("@constants/roles");
const { createHttpException, MESSAGE_UTIL } = require("@utils");
const MESSAGES = require("@constants/messages");

module.exports = (Model) => ({
  async getProfile(login, role) {

    const whereClause = (
      (Model.name === "user" && USER_ROLES.includes(role))
        ? { email: login }
        : (Model.name === "admin" && ADMIN_ROLES.includes(role))
          ? { [Op.or]: { email: login, login } }
          : null
    );

    if (!whereClause) {
      const notFoundException = createHttpException(404, MESSAGE_UTIL.ERRORS.NOT_FOUND(Model.name));
      throw notFoundException;
    }

    const foundUser = await Model.findOne({ where: whereClause });

    if (!foundUser) {
      const notFoundException = createHttpException(404, MESSAGE_UTIL.ERRORS.NOT_FOUND(Model.name));
      throw notFoundException;
    }

    return foundUser;
  },

  async updatePassword(login, role, { currentPassword, newPassword }) {

    const whereClause = (
      (Model.name === "user" && USER_ROLES.includes(role))
        ? { email: login }
        : (Model.name === "admin" && ADMIN_ROLES.includes(role))
          ? { [Op.or]: { email: login, login } }
          : null
    );

    if (!whereClause) {
      const notFoundException = createHttpException(404, MESSAGE_UTIL.ERRORS.NOT_FOUND(Model.name));
      throw notFoundException;
    }

    const foundUser = await Model.findOne({
      where: whereClause,
      attributes: ['id', 'password']
    });

    if (!foundUser) {
      const notFoundException = createHttpException(404, MESSAGE_UTIL.ERRORS.NOT_FOUND(Model.name));
      throw notFoundException;
    }

    const passwordsMatch = await bcrypt.compare(currentPassword, foundUser.password);

    if (!passwordsMatch) {
      const unauthorizedException = createHttpException(401, MESSAGES.ERRORS.INCORRECT_PASSWORD);
      throw unauthorizedException;
    }

    const hashedPassword = await bcrypt.hash(newPassword, parseInt(process.env.PASSWORD_SALT_ROUNDS));

    foundUser.password = hashedPassword;
    await foundUser.save();

    return { message: MESSAGES.SUCCESS.PASSWORD_UPDATED };
  }
});
