const createHttpException = require("@utils/createHttpException");
const MESSAGES = require("@constants/messages");

module.exports = (Model) => ({
  async getProfile(id) {
    const foundUser = await Model.findByPk(id);
    if (!foundUser) {
      const notFoundException = createHttpException(404, MESSAGES.ERRORS.USER_NOT_FOUND);
      throw notFoundException;
    }
    return foundUser;
  },

  async updatePassword(id, { currentPassword, newPassword }) {
    const foundUser = await Model.findByPk(id, {
      attributes: ['id', 'password']
    });

    if (!foundUser) {
      const notFoundException = createHttpException(404, MESSAGES.ERRORS.USER_NOT_FOUND);
      throw notFoundException;
    }

    const passwordsMatch = await bcrypt.compare(currentPassword, foundUser.password);

    if (!passwordsMatch) {
      const unauthorizedException = createHttpException(401, MESSAGES.ERRORS.INCORRECT_PASSWORD);
      throw unauthorizedException;
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    foundUser.password = hashedPassword;
    await foundUser.save();

    return { message: MESSAGES.SUCCESS.PASSWORD_UPDATED };
  }
});