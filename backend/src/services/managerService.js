const conn = require("@config/conn");
const { Sequelize, Op } = require("sequelize");
const MESSAGES = require("@constants/messages");
const { createHttpException, MESSAGE_UTIL } = require("@utils");
const { STATUS } = require("@constants/status");
const { SQL_USERS_EMPLOYED_QUERY } = require("@constants/sql");
const { mutateDates } = require("@models/hooks");
const { Project, Task, User, TaskReport } = require("@models")(conn);

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
	if (!STATUS.includes(status)) {
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
			...(status === STATUS[0] ? { endDate: 0 } : { endDate: { [Op.gt]: 0 } })
		},
		attributes: [
			["id", "projectId"],
			"projectName",
			"startDate",
			"endDate",
			[USERS_EMPLOYED_QUERY, "usersEmployed"]
		],
		order: [
			...(status === STATUS[0]
				? [["startDate", "DESC"]]
				: [["endDate", "DESC"]])
		]
	});
	return projectList;
};

exports.getTaskReports = async (taskId, managerId) => {
	const foundTask = await Task.findOne({
		where: {
			id: taskId,
			completeDate: 0
		},
		attributes: ["projectId"],
		include: [
			{
				model: Project,
				as: "TaskProject",
				attributes: ["managerId"]
			},
			{
				model: User,
				as: "TaskUser",
				attributes: { exclude: ["password", "role"] }
			}
		]
	});

	if (!foundTask) {
		const notFoundException = createHttpException(
			404,
			MESSAGE_UTIL.ERRORS.NOT_FOUND("Task")
		);
		throw notFoundException;
	}

	const plainTask = foundTask.get({ plain: true });

	if (plainTask.TaskProject.managerId !== managerId) {
		const unprocessableException = createHttpException(
			422,
			MESSAGES.ERRORS.ASSOCIATED_MANAGER_TASK_REPORTS
		);
		throw unprocessableException;
	}

	mutateDates(plainTask.TaskUser, "lastLogin");

	const taskReports = await TaskReport.findAll({
		where: { taskId },
		order: [["createDate", "DESC"]],
		raw: true
	});

	return {
		user: plainTask.TaskUser,
		reports: taskReports
	};
};
