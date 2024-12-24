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
			const answer = await managerService.getProjectUsers(
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
	"/projects/:status",
	[verifyTokenMiddleware("access"), checkRolesMiddleware([USER_ROLES[0]])],
	async (req, res) => {
		try {
			const answer = await managerService.getMyProjects(
				req.user.id,
				req.params.status.toUpperCase()
			);
			return res.send(answer);
		} catch (error) {
			const { status, message } = statusCodeMessage(error);
			return res.status(status).send({ message });
		}
	}
);

router.put(
	"/projects/users/toggle/:id",
	[verifyTokenMiddleware("access"), checkRolesMiddleware([USER_ROLES[0]])],
	async (req, res) => {
		try {
			const { idArray } = req.body;
			const answer = await managerService.toggleUsers(
				req.user.id,
				req.params.id,
				idArray
			);
			return res.send(answer);
		} catch (error) {
			console.log("toggle error", error);
			const { status, message } = statusCodeMessage(error);
			return res.status(status).send({ message });
		}
	}
);

module.exports = router;
