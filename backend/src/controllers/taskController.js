const { Router } = require("express");
const router = Router();
const conn = require("@config/conn");
const { Task, TaskReport } = require("@models")(conn);
const { ADMIN_ROLES, USER_ROLES } = require("@constants/roles");
const {
	verifyTokenMiddleware,
	checkRolesMiddleware
} = require("@middlewares/auth");
const {
	abstractCreateValidateSchema,
	abstractUpdateValidateSchema
} = require("@middlewares/validation/schemas");
const {
	createTaskMiddleware,
	updateTaskMiddleware,
	createTaskReportMiddleware
} = require("@middlewares/validation/task");

const { statusCodeMessage } = require("@utils");

const taskReportService = require("@services/taskReportService");
const taskService = require("@services/taskService");

const taskDeleteService = require("@services/abstractDeleteService")(Task);
const taskReportDeleteService = require("@services/abstractDeleteService")(
	TaskReport
);


router.post(
	"/",
	[
		verifyTokenMiddleware("access"),
		checkRolesMiddleware([...ADMIN_ROLES, USER_ROLES[0]]),
		abstractCreateValidateSchema(Task, ["createDate", "deadLineDate"]),
		createTaskMiddleware
	],
	async (req, res) => {
		try {
			const { id, role } = req.user;
			const managerId = role === USER_ROLES[0] ? id : null;
			const answer = await taskService.createTask(req.body, managerId);
			return res.status(201).send(answer);
		} catch (error) {
			const [errorType, errorDetails] = Object.values(error);
			if (errorType === "SequelizeUniqueConstraintError") {
				const { message } = errorDetails[0];
				return res.status(400).send({ message });
			}
			const { status, message } = statusCodeMessage(error);
			return res.status(status).send({ message });
		}
	}
);

router.patch(
	"/:id",
	[
		verifyTokenMiddleware("access"),
		checkRolesMiddleware([...ADMIN_ROLES, USER_ROLES[0]]),
		abstractUpdateValidateSchema(Task, [
			"createDate",
			"deadLineDate",
			"completeDate"
		]),
		updateTaskMiddleware
	],
	async (req, res) => {
		try {
			const { id, role } = req.user;
			const managerId = role === USER_ROLES[0] ? id : null;
			const answer = await taskService.updateTask(
				req.params.id,
				req.body,
				managerId
			);
			return res.send(answer);
		} catch (error) {
			const [errorType, errorDetails] = Object.values(error);
			if (errorType === "SequelizeUniqueConstraintError") {
				const { message } = errorDetails[0];
				return res.status(400).send({ message });
			}
			const { status, message } = statusCodeMessage(error);
			return res.status(status).send({ message });
		}
	}
);

router.patch(
	"/toggle/:id",
	[
		verifyTokenMiddleware("access"),
		checkRolesMiddleware([...ADMIN_ROLES, USER_ROLES[0]])
	],
	async (req, res) => {
		try {
			const { id, role } = req.user;
			const managerId = role === USER_ROLES[0] ? id : null;
			const answer = await taskService.toggle(req.params.id, managerId);
			return res.send(answer);
		} catch (error) {
			const { status, message } = statusCodeMessage(error);
			return res.status(status).send({ message });
		}
	}
);

router.post(
	"/report/:taskId",
	[
		verifyTokenMiddleware("access"),
		checkRolesMiddleware([USER_ROLES[1]]),
		abstractCreateValidateSchema(TaskReport, ["createDate", "taskId"]),
		createTaskReportMiddleware
	],
	async (req, res) => {
		try {
			const answer = await taskReportService.createTaskReport(
				req.params.taskId,
				req.user.id,
				req.body
			);
			return res.status(201).send(answer);
		} catch (error) {
			const { status, message } = statusCodeMessage(error);
			return res.status(status).send({ message });
		}
	}
);

router.patch(
	"/report/manager-response/:taskReportId",
	[verifyTokenMiddleware("access"), checkRolesMiddleware([USER_ROLES[0]])],
	async (req, res) => {
		try {
			const answer = await taskReportService.addManagerResponse(
				req.params.taskReportId,
				req.user.id,
				req.body
			);
			return res.send(answer);
		} catch (error) {
			const { status, message } = statusCodeMessage(error);
			return res.status(status).send({ message });
		}
	}
);

router.delete(
	"/:id",
	[
		verifyTokenMiddleware("access"),
		checkRolesMiddleware([ADMIN_ROLES[0], USER_ROLES[0]])
	],
	async (req, res) => {
		try {
			const answer = await taskDeleteService.delete(req.params.id);
			return res.send(answer);
		} catch (error) {
			const { status, message } = statusCodeMessage(error);
			return res.status(status).send({ message });
		}
	}
);

router.delete(
	"/report/:taskReportId",
	[
		verifyTokenMiddleware("access"),
		checkRolesMiddleware([ADMIN_ROLES[0], USER_ROLES[0]])
	],
	async (req, res) => {
		try {
			const answer = await taskReportDeleteService.delete(
				req.params.taskReportId
			);
			return res.send(answer);
		} catch (error) {
			const { status, message } = statusCodeMessage(error);
			return res.status(status).send({ message });
		}
	}
);

module.exports = router;
