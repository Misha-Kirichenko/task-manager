const conn = require("@config/conn");
const { QueryTypes } = require("sequelize");
const { USER_ROLES } = require("@constants/roles");
const { SQL_ASSIGN_USERS } = require("@constants/sql");
const MESSAGES = require("@constants/messages");
const { MESSAGE_UTIL, createHttpException } = require("@utils");
const { Project, UserProjects } = require("@models")(conn);

exports.getMyProjects = async (userId) => {
	const projectList = await Project.findAll({
		where: { managerId: userId },
		attributes: [["id", "projectId"], "projectName", "startDate"],
		order: [["startDate", "DESC"]]
	});
	return projectList;
};


exports.getProjectUsers = async (projectId, userId) => {
	const projectList = await Project.findAll({
		where: { managerId: userId },
		attributes: [["id", "projectId"], "projectName", "startDate"],
		order: [["startDate", "DESC"]]
	});
	return projectList;
};

exports.assignUsers = async (managerId, projectId, idArray) => {
	const foundProject = await Project.findByPk(projectId, {
		attributes: ["id", "managerId"]
	});

	if (!foundProject) {
		const notFoundException = createHttpException(
			404,
			MESSAGE_UTIL.ERRORS.NOT_FOUND("Project")
		);
		throw notFoundException;
	}

	if (foundProject.managerId !== managerId) {
		const unprocessableException = createHttpException(
			422,
			MESSAGES.ERRORS.ASSIGN_USERS_TO_PROJECT
		);
		throw unprocessableException;
	}

	const [_, rowCount] = await conn.query(SQL_ASSIGN_USERS, {
		bind: [projectId, idArray, USER_ROLES[0]],
		type: QueryTypes.INSERT
	});

	if (rowCount == 0) {
		const message = `Conflict: selected users can't be assigned to this project`;
		const conflictException = createHttpException(409, message);
		throw conflictException;
	}

	if (rowCount < idArray.length) {
		const message = `Operation partially successful: ${rowCount} of ${idArray.length} users were assigned to this project.`;
		const partialInsertException = createHttpException(207, message);
		throw partialInsertException;
	}

	const message = `Operation successful: ${rowCount} users were assigned to this project`;
	return { message };
};

exports.unassign = async (managerId, projectId, idArray) => {
	const foundProject = await Project.findByPk(projectId, {
		attributes: ["id", "managerId"]
	});

	if (!foundProject) {
		const notFoundException = createHttpException(
			404,
			MESSAGE_UTIL.ERRORS.NOT_FOUND("Project")
		);
		throw notFoundException;
	}

	if (foundProject.managerId !== managerId) {
		const unprocessableException = createHttpException(
			422,
			MESSAGES.ERRORS.UNASSIGN_USERS
		);
		throw unprocessableException;
	}

	const totalUnassigned = await UserProjects.destroy({
		where: {
			projectId,
			userId: {
				[Op.in]: idArray
			}
		}
	});

	if (totalUnassigned == 0) {
		const message = `Conflict: selected users are not assigned to this project, so they can't be unassigned`;
		const conflictException = createHttpException(409, message);
		throw conflictException;
	}

	const message = `Operation successful: ${totalUnassigned} users unassigned from this project`;
	return { message };
};
