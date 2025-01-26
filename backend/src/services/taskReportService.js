const conn = require("@config/conn");
const MESSAGES = require("@constants/messages");
const { MESSAGE_UTIL, createHttpException } = require("@utils");
const { TaskReport, Task, Project } = require("@models")(conn);

exports.createTaskReport = async (taskId, userId, reportData) => {
	const foundTask = await Task.findByPk(taskId, {
		attributes: ["completeDate", "userId"]
	});

	if (!foundTask) {
		const notFoundException = createHttpException(
			404,
			MESSAGE_UTIL.ERRORS.NOT_FOUND("Task")
		);
		throw notFoundException;
	}

	if (foundTask.completeDate) {
		const unprocessableException = createHttpException(
			422,
			MESSAGES.ERRORS.REPORT_ON_COMPLETED_TASK
		);
		throw unprocessableException;
	}

	if (foundTask.userId !== userId) {
		const unprocessableException = createHttpException(
			422,
			MESSAGES.ERRORS.ASSOCIATED_USER_REPORT
		);
		throw unprocessableException;
	}

	await TaskReport.create({ taskId, ...reportData });
	return { message: MESSAGE_UTIL.SUCCESS.CREATED("Task report") };
};



exports.addManagerResponse = async (taskReportId, managerId, responseData) => {
	const { managerResponse, ...otherData } = responseData;

	if (Object.keys(otherData).length) {
		const badRequestException = createHttpException(
			400,
			MESSAGES.ERRORS.UNACCEPTABLE_FIELDS
		);
		throw badRequestException;
	}

	if (!managerResponse) {
		const badRequestException = createHttpException(
			400,
			MESSAGES.ERRORS.EMPTY_MANAGERS_RESPONSE
		);
		throw badRequestException;
	}

	if (typeof managerResponse !== "string") {
		const badRequestException = createHttpException(
			400,
			MESSAGES.ERRORS.MANAGER_RESPONSE_TYPE
		);
		throw badRequestException;
	}

	const foundTaskReport = await TaskReport.findByPk(taskReportId, {
		include: [
			{
				model: Task,
				as: "TaskReportTask",
				attributes: ["projectId", "completeDate"]
			}
		]
	});

	if (!foundTaskReport) {
		const notFoundException = createHttpException(
			404,
			MESSAGE_UTIL.ERRORS.NOT_FOUND("Task report")
		);
		throw notFoundException;
	}

	if (JSON.parse(foundTaskReport.TaskReportTask.completeDate)) {
		const unprocessableException = createHttpException(
			422,
			MESSAGES.ERRORS.ANSWER_ON_COMPLETED_TASK
		);
		throw unprocessableException;
	}

	const { projectId } = foundTaskReport.TaskReportTask;

	const foundProject = await Project.findByPk(projectId, {
		attributes: ["managerId"]
	});

	if (foundProject.managerId !== managerId) {
		const unprocessableException = createHttpException(
			422,
			MESSAGES.ERRORS.ASSOCIATED_MANAGER_ANSWER
		);
		throw unprocessableException;
	}

	foundTaskReport.managerResponse = managerResponse;
	foundTaskReport.managerResponseDate = Date.now();

	await foundTaskReport.save();

	return { message: MESSAGES.SUCCESS.MANAGERS_RESPONSE };
};
