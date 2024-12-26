const conn = require("@config/conn");
const { Sequelize, Op } = require("sequelize");
const MESSAGES = require("@constants/messages");
const { createHttpException } = require("@utils");
const { PROJECT_STATUS } = require("@constants/projectStatus");
const { SQL_USERS_EMPLOYED_QUERY } = require("@constants/sql");
const { Project } = require("@models")(conn);

exports.getMyProject = async (projectId, managerId) => {
	const foundProject = await Project.findOne({
		id: projectId,
		managerId,
		attributes: {
			exclude: ["managerId"]
		}
	});

	if (!foundProject) {
		const notFoundException = createHttpException(
			404,
			MESSAGE_UTIL.ERRORS.NOT_FOUND("Project")
		);
		throw notFoundException;
	}

	return foundProject;
};

exports.getMyProjects = async (managerId, status) => {
	if (!PROJECT_STATUS.includes(status)) {
		const unprocessableException = createHttpException(
			422,
			MESSAGES.ERRORS.INVALID_PROJECT_STATUS
		);
		throw unprocessableException;
	}

	const USERS_EMPLOYED_QUERY = Sequelize.literal(SQL_USERS_EMPLOYED_QUERY);

	const projectList = await Project.findAll({
		where: {
			managerId,
			...(status === PROJECT_STATUS[0]
				? { endDate: 0 }
				: { endDate: { [Op.gt]: 0 } })
		},
		attributes: [
			["id", "projectId"],
			"projectName",
			"startDate",
			"endDate",
			[USERS_EMPLOYED_QUERY, "usersEmployed"]
		],
		order: [
			...(status === PROJECT_STATUS[0]
				? [["startDate", "DESC"]]
				: [["endDate", "DESC"]])
		]
	});
	return projectList;
};
