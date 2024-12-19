const conn = require("@config/conn");
const { QueryTypes, Op } = require("sequelize");
const { ADMIN_ROLES } = require("@constants/roles");
const { Project, User, UserProjects } = require("@models")(conn);
const { USER_ROLES } = require("@constants/roles");
const MESSAGES = require("@constants/messages");
const { MESSAGE_UTIL, createHttpException } = require("@utils");

exports.createProject = async (body) => {
	if (body.managerId) {
		const foundUser = await User.findByPk(body.managerId, {
			attributes: ["role"]
		});

		if (!foundUser) {
			const badRequestException = createHttpException(
				400,
				MESSAGES.ERRORS.UNKNOWN_USER
			);
			throw badRequestException;
		}

		if (foundUser.role !== USER_ROLES[0]) {
			const badRequestException = createHttpException(
				400,
				MESSAGES.ERRORS.ACCEPT_MANAGER
			);
			throw badRequestException;
		}
	}

	await Project.create(body);
	return { message: MESSAGE_UTIL.SUCCESS.CREATED("Project") };
};

exports.updateProject = async (id, body) => {
	const foundProject = await Project.findByPk(id, {
		attributes: ["id"]
	});

	if (!foundProject) {
		const notFoundException = createHttpException(
			404,
			MESSAGE_UTIL.ERRORS.NOT_FOUND("Project")
		);
		throw notFoundException;
	}

	if (body.managerId) {
		const foundUser = await User.findByPk(body.managerId, {
			attributes: ["role"]
		});
		if (foundUser.role !== USER_ROLES[0]) {
			const badRequestException = createHttpException(
				400,
				MESSAGES.ERRORS.ACCEPT_MANAGER
			);
			throw badRequestException;
		}
	}

	for (const field in body) {
		foundProject[field] = body[field];
	}

	await foundProject.save();

	return { message: MESSAGE_UTIL.SUCCESS.UPDATED("Project's data") };
};

exports.toggle = async (userData, id) => {
	const foundProject = await Project.findByPk(id, {
		attributes: ["id", "endDate", "managerId"]
	});

	if (!foundProject) {
		const notFoundException = createHttpException(
			404,
			MESSAGE_UTIL.ERRORS.NOT_FOUND("Project")
		);
		throw notFoundException;
	}

	const { managerId, endDate } = foundProject;

	if (!ADMIN_ROLES.includes(userData.role) && managerId !== userData.id) {
		const unprocessableException = createHttpException(
			422,
			MESSAGE_UTIL.ERRORS.PROJECT_ASSOC_MANAGER(
				foundProject.endDate ? "start" : "finish"
			)
		);

		throw unprocessableException;
	}

	const endDateState = Number(endDate) ? 0 : Date.now();
	foundProject.endDate = endDateState;

	await foundProject.save();

	return { endDate: endDateState };
};

exports.assignUsers = async (userData, projectId, idArray) => {
	const sql = `
	INSERT INTO user_projects ("userId", "projectId")
	SELECT u.id, $1 FROM users u WHERE u.id = ANY ($2) AND u.role != '${USER_ROLES[0]}'
	ON CONFLICT ("userId", "projectId") DO NOTHING;`;

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

	if (
		!ADMIN_ROLES.includes(userData.role) &&
		foundProject.managerId !== userData.id
	) {
		const unprocessableException = createHttpException(
			422,
			MESSAGES.ERRORS.ASSIGN_USERS_TO_PROJECT
		);
		throw unprocessableException;
	}

	const [_, rowCount] = await conn.query(sql, {
		bind: [projectId, idArray],
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

exports.unassign = async (userData, projectId, idArray) => {
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

	if (
		!ADMIN_ROLES.includes(userData.role) &&
		foundProject.managerId !== userData.id
	) {
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
