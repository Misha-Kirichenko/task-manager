const bcrypt = require("bcrypt");
const createHttpException = require("@utils/createHttpException");
const generateTokenPairs = require("@utils/securityUtils");
const MESSAGES = require("@constants/messages");

module.exports = (Model) => ({
  async login(email, password) {

    if (!email || !password) {
      const badRequestException = createHttpException(400, MESSAGES.ERRORS.ALL_FIELDS_REQUIRED);
      throw badRequestException;
    }

    const foundUser = await Model.findOne({
      where: { email },
    });

    if (foundUser) {
      const passwordsMatch = await bcrypt.compare(password, foundUser.password);
      if (passwordsMatch) {
        const { id, email, role } = foundUser;
        const tokenPairs = generateTokenPairs({ id, email, ...(role && { role }) });

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
