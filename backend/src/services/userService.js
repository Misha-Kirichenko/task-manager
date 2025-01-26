const { Op } = require("sequelize");
const conn = require("@config/conn");
const { getUserProjectsQueryPipe } = require("./pipes");
const MESSAGES = require("@constants/messages");
const { MESSAGE_UTIL, createHttpException } = require("@utils");
const { UserProjects, Project, User, Task, TaskReport } =
	require("@models")(conn);

exports.getMyProject = async (projectId, userId) => {
	const userProjectExists = await UserProjects.count({
		where: {
			userId,
			projectId
		}
	});

	if (!userProjectExists) {
		const notFoundException = createHttpException(
			404,
			MESSAGE_UTIL.ERRORS.NOT_FOUND("Project")
		);
		throw notFoundException;
	}

	const foundProject = await Project.findOne({
		where: { id: projectId, endDate: 0 },
		attributes: { exclude: ["managerId", "endDate"] },
		include: [
			{
				model: User,
				as: "Manager",
				attributes: { exclude: ["role", "password", "id"] }
			}
		]
	});

	if (!foundProject) {
		const notFoundException = createHttpException(
			404,
			MESSAGE_UTIL.ERRORS.NOT_FOUND("Project")
		);
		throw notFoundException;
	}

	const plainFoundProject = foundProject.get({ plain: true });

	if (plainFoundProject.Manager) {
		mutateDates(plainFoundProject.Manager, "lastLogin");
	}

	return plainFoundProject;
};

exports.getMyProjects = async (userId) => {
	const projects = await UserProjects.findAll(getUserProjectsQueryPipe(userId));
	return projects.map((project) => {
		const plainProject = project.Project.get({ plain: true });
		mutateDates(plainProject, "startDate");
		return {
			projectId: plainProject.id,
			projectName: plainProject.projectName,
			startDate: plainProject.startDate,
			manager: plainProject.Manager.manager
		};
	});
};

exports.getMyProjectTasks = async (projectId, userId) => {
	const userProjectExists = await UserProjects.count({
		where: {
			userId,
			projectId
		}
	});

	if (!userProjectExists) {
		const notFoundException = createHttpException(
			404,
			MESSAGE_UTIL.ERRORS.NOT_FOUND("Project")
		);
		throw notFoundException;
	}

	const tasks = await Task.findAll({
		where: {
			projectId,
			userId,
			completeDate: { [Op.gt]: 0 }
		},
		attributes: {
			exclude: ["projectId", "userId", "completeDate"]
		},
		order: [["createDate", "DESC"]]
	});

	return tasks;
};


exports.getTaskReports = async (taskId, userId) => {
	const foundTask = await Task.findOne({
		where: {
			id: taskId,
			completeDate: 0
		},
		attributes: ["projectId", "userId"],
		include: [
			{
				model: Project,
				as: "TaskProject",
				attributes: ["managerId"]
			},
		]
	});

	if (!foundTask) {
		const notFoundException = createHttpException(
			404,
			MESSAGE_UTIL.ERRORS.NOT_FOUND("Task")
		);
		throw notFoundException;
	}

	if (foundTask.userId !== userId) {
		const unprocessableException = createHttpException(
			422,
			MESSAGES.ERRORS.ASSOCIATED_USER_TASK_REPORTS
		);
		throw unprocessableException;
	}

	const plainTask = foundTask.get({ plain: true });

	const taskReports = await TaskReport.findAll({
		where: { taskId },
		order: [["createDate", "DESC"]],
		raw: true
	});

	const manager = await User.findByPk(plainTask.TaskProject.managerId, {
		attributes: { exclude: ["role", "id"] },
		raw: true
	});

	return {
		manager,
		reports: taskReports
	};
};
