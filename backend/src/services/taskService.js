const conn = require("@config/conn");
const MESSAGES = require("@constants/messages");
const { MESSAGE_UTIL, createHttpException } = require("@utils");
const { USER_ROLES } = require("@constants/roles");
const { STATUS } = require("@constants/status");
const mutateDates = require("@models/hooks/mutateDates");
const { User, Task, Project, UserProjects } = require("@models")(conn);

exports.createTask = async (body, managerId) => {
	const { projectId, userId } = body;

	if (userId) {
		const foundUsersProject = await UserProjects.count({
			where: { userId, projectId }
		});

		if (!foundUsersProject) {
			const unprocessableException = createHttpException(
				422,
				MESSAGES.ERRORS.UNKNOWN_USER
			);
			throw unprocessableException;
		}
	}

	if (managerId) {
		const foundProject = await Project.findOne({
			where: { id: projectId },
			attributes: ["managerId"]
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
				MESSAGES.ERRORS.ASSIGN_TASK_TO_PROJECT
			);
			throw unprocessableException;
		}
	}

	await Task.create(body);
	return { message: MESSAGE_UTIL.SUCCESS.CREATED("Task") };
};

exports.getProjectTasks = async (status, id, managerId) => {
	if (!STATUS.includes(status)) {
		const unprocessableException = createHttpException(
			422,
			MESSAGES.ERRORS.INVALID_TASK_STATUS
		);
		throw unprocessableException;
	}

	const foundProject = await Project.count({
		where: { id, ...(managerId && { managerId }) }
	});

	if (!foundProject) {
		const notFoundException = createHttpException(
			404,
			MESSAGE_UTIL.ERRORS.NOT_FOUND("Project")
		);
		throw notFoundException;
	}

	const tasks = await Task.findAll({
		where: {
			projectId: id,
			complete: !(status === STATUS[0])
		},
		attributes: {
			exclude: ["projectId", "userId"]
		},
		include: [
			{
				model: User,
				as: "TaskUser",
				attributes: { exclude: ["password", "role"] }
			}
		],
		order: [["createDate", "DESC"]]
	});

	return tasks.map((task) => {
		const plainTaskUser = task.TaskUser.get({ plain: true });
		mutateDates(plainTaskUser, "lastLogin");
		return {
			id: task.taskId,
			taskName: task.taskName,
			taskDescription: task.taskDescription,
			complete: task.complete,
			TaskUser: plainTaskUser,
			createDate: task.createDate,
			deadLineDate: task.deadLineDate
		};
	});
};

exports.toggle = async (id, managerId) => {
	const foundTask = await Task.findByPk(id, {
		attributes: ["id", "projectId", "complete"]
	});

	if (!foundTask) {
		const notFoundException = createHttpException(
			404,
			MESSAGE_UTIL.ERRORS.NOT_FOUND("Task")
		);
		throw notFoundException;
	}

	const foundProject = await Project.findByPk(foundTask.projectId, {
		attributes: ["endDate", "managerId"]
	});

	if (foundProject.endDate) {
		const unprocessableException = createHttpException(
			422,
			MESSAGES.ERRORS.NO_TOGGLE_ON_COMPLETED_PROJECT
		);
		throw unprocessableException;
	}

	if (managerId && foundProject.managerId != managerId) {
		const unprocessableException = createHttpException(
			422,
			MESSAGES.ERRORS.ASSOC_MANAGER_TOGGLE_TASK
		);
		throw unprocessableException;
	}

	await Task.update({ complete: !foundTask.complete }, { where: { id } });

	return { message: MESSAGE_UTIL.SUCCESS.TOGGLE_TASK(!foundTask.complete) };
};
