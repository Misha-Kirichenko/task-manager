const conn = require("@config/conn");
const { ADMIN_ROLES } = require("@constants/roles");
const { Project, User } = require("@models")(conn);
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