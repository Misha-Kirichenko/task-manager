const { Op } = require("sequelize");
const conn = require("@config/conn");
const MESSAGES = require("@constants/messages");
const { MESSAGE_UTIL, createHttpException } = require("@utils");
const { STATUS } = require("@constants/status");
const mutateDates = require("@models/hooks/mutateDates");
const { User, Task, Project, UserProjects } = require("@models")(conn);

const updateTaskData = async (foundRecord, taskData, projectId, managerId) => {
	const foundProject = await Project.findByPk(projectId);

	if (foundProject.endDate) {
		const unprocessableException = createHttpException(
			422,
			MESSAGES.ERRORS.NO_UPDATE_ON_COMPLETED_PROJECT
		);
		throw unprocessableException;
	}

	if (managerId && foundProject.managerId != managerId) {
		const unprocessableException = createHttpException(
			422,
			MESSAGES.ERRORS.ASSOC_MANAGER_UPDATE_TASK
		);
		throw unprocessableException;
	}

	if (taskData.userId) {
		const foundUsersProject = await UserProjects.count({
			where: { userId: taskData.userId, projectId }
		});

		if (!foundUsersProject) {
			const unprocessableException = createHttpException(
				422,
				MESSAGES.ERRORS.UNKNOWN_USER
			);
			throw unprocessableException;
		}
	}

	for (const key in taskData) {
		foundRecord[key] = taskData[key];
	}

	await foundRecord.save();
};

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
			completeDate: status === STATUS[0] ? { [Op.eq]: 0 } : { [Op.gt]: 0 }
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
			completeDate: task.completeDate,
			TaskUser: plainTaskUser,
			createDate: task.createDate,
			deadLineDate: task.deadLineDate
		};
	});
};

exports.toggle = async (id, managerId) => {
	const foundTask = await Task.findByPk(id);

	if (!foundTask) {
		const notFoundException = createHttpException(
			404,
			MESSAGE_UTIL.ERRORS.NOT_FOUND("Task")
		);
		throw notFoundException;
	}

	const completeDateState = foundTask.completeDate ? 0 : Date.now();

	await updateTaskData(
		foundTask,
		{ completeDate: completeDateState },
		foundTask.projectId,
		managerId
	);

	return { completeDate: completeDateState };
};

exports.updateTask = async (id, body, managerId) => {
	const foundTask = await Task.findByPk(id);

	if (!foundTask) {
		const notFoundException = createHttpException(
			404,
			MESSAGE_UTIL.ERRORS.NOT_FOUND("Task")
		);
		throw notFoundException;
	}

	await updateTaskData(foundTask, body, foundTask.projectId, managerId);
	return { message: MESSAGES.SUCCESS.UPDATED_TASK };
};
