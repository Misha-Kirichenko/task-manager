const { Router } = require("express");
const router = Router();
const createAbstractUserController = require("@controllers/abstract/abstractUserController");
const conn = require("@config/conn");
const { Admin, User } = require("@models")(conn);
const { ADMIN_ROLES } = require("@constants/roles");
const {
	verifyTokenMiddleware,
	checkRolesMiddleware
} = require("@middlewares/auth");
const {
	abstractUpdateMiddleware,
	changeUserRoleMiddleware,
	abstractCreateMiddleware
} = require("@middlewares/validation");
const { getAllProjectsMiddleware } = require("@middlewares/validation/admin");
const {
	abstractUpdateValidateSchema,
	abstractCreateValidateSchema
} = require("@middlewares/validation/schemas");
const { statusCodeMessage } = require("@utils");
const adminService = require("@services/adminService");
const projectService = require("@services/projectService");
const userDeleteService = require("@services/abstractDeleteService")(User);

const abstractUserController = createAbstractUserController(Admin);

router.use("/", abstractUserController);

router.patch(
	"/user/role/:id",
	[
		verifyTokenMiddleware("access"),
		checkRolesMiddleware(ADMIN_ROLES),
		changeUserRoleMiddleware
	],
	async (req, res) => {
		try {
			const answer = await adminService.changeUserRole(
				req.params.id,
				req.body.role
			);
			return res.send(answer);
		} catch (error) {
			const { status, message } = statusCodeMessage(error);
			return res.status(status).send({ message });
		}
	}
);

router.patch(
	"/user/:id",
	[
		verifyTokenMiddleware("access"),
		checkRolesMiddleware(ADMIN_ROLES),
		abstractUpdateValidateSchema(User),
		abstractUpdateMiddleware
	],
	async (req, res) => {
		try {
			const answer = await adminService.updateUser(req.params.id, req.body);
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

router.post(
	"/user",
	[
		verifyTokenMiddleware("access"),
		checkRolesMiddleware([ADMIN_ROLES[0]]),
		abstractCreateValidateSchema(User),
		abstractCreateMiddleware
	],
	async (req, res) => {
		try {
			const answer = await adminService.createUser(req.body);
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

router.delete(
	"/user/:id",
	[verifyTokenMiddleware("access"), checkRolesMiddleware([ADMIN_ROLES[0]])],
	async (req, res) => {
		try {
			const answer = await userDeleteService.delete(req.params.id);
			return res.send(answer);
		} catch (error) {
			const { status, message } = statusCodeMessage(error);
			return res.status(status).send({ message });
		}
	}
);

router.delete(
	"/users",
	[verifyTokenMiddleware("access"), checkRolesMiddleware([ADMIN_ROLES[0]])],
	async (req, res) => {
		try {
			const { idArray } = req.body;
			const answer = await userDeleteService.deleteMany(idArray);
			return res.send(answer);
		} catch (error) {
			const { status, message } = statusCodeMessage(error);
			return res.status(status).send({ message });
		}
	}
);

router.get(
	"/users/:role",
	[
		verifyTokenMiddleware("access"),
		checkRolesMiddleware(ADMIN_ROLES),
		getAllProjectsMiddleware
	],
	async (req, res) => {
		try {
			const answer = await adminService.getAllUsers(
				req.params.role.toUpperCase()
			);
			return res.send(answer);
		} catch (error) {
			const { status, message } = statusCodeMessage(error);
			return res.status(status).send({ message });
		}
	}
);

router.get(
	"/projects/:status",
	[
		verifyTokenMiddleware("access"),
		checkRolesMiddleware(ADMIN_ROLES),
		getAllProjectsMiddleware
	],
	async (req, res) => {
		try {
			const answer = await projectService.getAllProjects(
				req.params.status.toUpperCase(),
				req.query
			);
			return res.send(answer);
		} catch (error) {
			const { status, message } = statusCodeMessage(error);
			return res.status(status).send({ message });
		}
	}
);

router.get(
	"/project/:id",
	[
		verifyTokenMiddleware("access"),
		checkRolesMiddleware(ADMIN_ROLES),
		getAllProjectsMiddleware
	],
	async (req, res) => {
		try {
			const answer = await projectService.getProject(req.params.id);
			return res.send(answer);
		} catch (error) {
			const { status, message } = statusCodeMessage(error);
			return res.status(status).send({ message });
		}
	}
);

module.exports = router;
