const { Router } = require("express");
const router = Router();
const conn = require("@config/conn");
const { Project } = require("@models")(conn);
const { ADMIN_ROLES, USER_ROLES } = require("@constants/roles");
const {
	verifyTokenMiddleware,
	checkRolesMiddleware
} = require("@middlewares/auth");
const {
	abstractCreateMiddleware,
	abstractUpdateMiddleware
} = require("@middlewares/validation");
const {
	abstractCreateValidateSchema,
	abstractUpdateValidateSchema
} = require("@middlewares/validation/schemas");
const { statusCodeMessage } = require("@utils");
const projectDeleteService = require("@services/abstractDeleteService")(
	Project
);

const projectService = require("@services/projectService");
const taskService = require("@services/taskService");

router.post(
	"/",
	[
		verifyTokenMiddleware("access"),
		checkRolesMiddleware(ADMIN_ROLES),
		abstractCreateValidateSchema(Project, ["endDate"]),
		abstractCreateMiddleware
	],
	async (req, res) => {
		try {
			const answer = await projectService.createProject(req.body);
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
	"/:id",
	[
		verifyTokenMiddleware("access"),
		checkRolesMiddleware(ADMIN_ROLES),
		abstractUpdateValidateSchema(Project, ["endDate"]),
		abstractUpdateMiddleware
	],
	async (req, res) => {
		try {
			const answer = await projectService.updateProject(
				req.params.id,
				req.body
			);
			return res.send(answer);
		} catch (error) {
			console.log("project update error", error);
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

router.delete(
	"/many",
	[verifyTokenMiddleware("access"), checkRolesMiddleware(ADMIN_ROLES)],
	async (req, res) => {
		try {
			const { idArray } = req.body;
			const answer = await projectDeleteService.deleteMany(idArray);
			return res.send(answer);
		} catch (error) {
			const { status, message } = statusCodeMessage(error);
			return res.status(status).send({ message });
		}
	}
);

router.delete(
	"/:id",
	[verifyTokenMiddleware("access"), checkRolesMiddleware(ADMIN_ROLES)],
	async (req, res) => {
		try {
			const answer = await projectDeleteService.delete(req.params.id);
			return res.send(answer);
		} catch (error) {
			const { status, message } = statusCodeMessage(error);
			return res.status(status).send({ message });
		}
	}
);

router.get(
	"/toggle/:id",
	[
		verifyTokenMiddleware("access"),
		checkRolesMiddleware([...ADMIN_ROLES, USER_ROLES[0]])
	],
	async (req, res) => {
		try {
			const answer = await projectService.toggle(req.user, req.params.id);
			return res.send(answer);
		} catch (error) {
			console.log("project toggle error", error);
			const { status, message } = statusCodeMessage(error);
			return res.status(status).send({ message });
		}
	}
);

router.get(
	"/users/:id",
	[
		verifyTokenMiddleware("access"),
		checkRolesMiddleware([...ADMIN_ROLES, USER_ROLES[0]])
	],
	async (req, res) => {
		try {
			const { id, role } = req.user;
			const answer = await projectService.getProjectUsers(
				req.params.id,
				role === USER_ROLES[0] ? id : null
			);

			return res.send(answer);
		} catch (error) {
			const { status, message } = statusCodeMessage(error);
			return res.status(status).send({ message });
		}
	}
);

router.put(
	"/users/toggle/:id",
	[
		verifyTokenMiddleware("access"),
		checkRolesMiddleware([...ADMIN_ROLES, USER_ROLES[0]])
	],
	async (req, res) => {
		try {
			const { idArray = [] } = req.body;
			const { id, role } = req.user;

			const answer = await projectService.toggleUsers(
				req.params.id,
				idArray,
				role === USER_ROLES[0] ? id : null
			);

			return res.send(answer);
		} catch (error) {
			const { status, message } = statusCodeMessage(error);
			return res.status(status).send({ message });
		}
	}
);

router.get(
	"/tasks/:status/:id",
	[
		verifyTokenMiddleware("access"),
		checkRolesMiddleware([...ADMIN_ROLES, USER_ROLES[0]])
	],
	async (req, res) => {
		try {
			const managerId = req.user.role === USER_ROLES[0] ? req.user.id : null;
			const answer = await taskService.getProjectTasks(
				req.params.status.toUpperCase(),
				req.params.id,
				managerId
			);

			return res.send(answer);
		} catch (error) {
			const { status, message } = statusCodeMessage(error);
			return res.status(status).send({ message });
		}
	}
);

module.exports = router;
