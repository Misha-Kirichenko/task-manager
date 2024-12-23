const { Router } = require("express");
const router = Router();
const conn = require("@config/conn");
const { User } = require("@models")(conn);
const {
	verifyTokenMiddleware,
	checkRolesMiddleware
} = require("@middlewares/auth");
const { statusCodeMessage } = require("@utils");

const { USER_ROLES } = require("@constants/roles");
const createAbstractUserController = require("@controllers/abstract/abstractUserController");
const managerService = require("@services/managerService");

const abstractUserController = createAbstractUserController(User, [
	USER_ROLES[0]
]);

router.use("/", abstractUserController);

router.get(
	"/projects/users/:id",
	[verifyTokenMiddleware("access"), checkRolesMiddleware([USER_ROLES[0]])],
	async (req, res) => {
		try {
			const answer = await managerService.geProjectUsers(
				req.params.id,
				req.user.id
			);
			return res.send(answer);
		} catch (error) {
			const { status, message } = statusCodeMessage(error);
			return res.status(status).send({ message });
		}
	}
);

router.get(
	"/projects",
	[verifyTokenMiddleware("access"), checkRolesMiddleware([USER_ROLES[0]])],
	async (req, res) => {
		try {
			const answer = await managerService.getMyProjects(req.user.id);
			return res.send(answer);
		} catch (error) {
			console.log("managerProjectsError", error);
			const { status, message } = statusCodeMessage(error);
			return res.status(status).send({ message });
		}
	}
);

router.post(
	"/projects/assign/:id",
	[verifyTokenMiddleware("access"), checkRolesMiddleware([USER_ROLES[0]])],
	async (req, res) => {
		try {
			const { idArray } = req.body;
			const answer = await managerService.assignUsers(
				req.user.id,
				req.params.id,
				idArray
			);
			return res.send(answer);
		} catch (error) {
			const { status, message } = statusCodeMessage(error);
			return res.status(status).send({ message });
		}
	}
);

router.delete(
	"/projects/unassign/:id",
	[verifyTokenMiddleware("access"), checkRolesMiddleware([USER_ROLES[0]])],
	async (req, res) => {
		try {
			const { idArray } = req.body;
			const answer = await managerService.unassign(
				req.user.id,
				req.params.id,
				idArray
			);
			return res.send(answer);
		} catch (error) {
			const { status, message } = statusCodeMessage(error);
			return res.status(status).send({ message });
		}
	}
);

module.exports = router;
