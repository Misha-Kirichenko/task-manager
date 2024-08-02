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
  }
});