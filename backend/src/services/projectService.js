const conn = require('@config/conn');
const { Project, User } = require('@models')(conn);
const { USER_ROLES } = require("@constants/roles");
const MESSAGES = require("@constants/messages");
const { MESSAGE_UTIL, createHttpException } = require("@utils");


exports.createProject = async (body) => {
  if (body.managerId) {
    const foundUser = await User.findByPk(body.managerId, {
      attributes: ['role'],
    });
    if (foundUser.role !== USER_ROLES[0]) {
      const badRequestException = createHttpException(400, MESSAGES.ERRORS.ACCEPT_MANAGER);
      throw badRequestException;
    }
  }
  await Project.create(body);
  return { message: MESSAGE_UTIL.SUCCESS.CREATED("Project") };
}