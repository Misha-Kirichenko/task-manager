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
const projectService = require("@services/projectService");
const userService = require("@services/userService");

const abstractUserController = createAbstractUserController(User, [
	USER_ROLES[1]
]);

router.use("/", abstractUserController);

router.get(
	"/projects",
	[verifyTokenMiddleware("access"), checkRolesMiddleware([USER_ROLES[1]])],
	async (req, res) => {
		try {
			const answer = await userService.getMyProjects(req.user.id);
			return res.send(answer);
		} catch (error) {
			const { status, message } = statusCodeMessage(error);
			return res.status(status).send({ message });
		}
	}
);

router.get(
	"/project/:id",
	[verifyTokenMiddleware("access"), checkRolesMiddleware([USER_ROLES[1]])],
	async (req, res) => {
		try {
			const userData = { role: req.user.role, userId: req.user.id };
			const answer = await projectService.getProject(req.params.id, userData);
			return res.send(answer);
		} catch (error) {
			const { status, message } = statusCodeMessage(error);
			return res.status(status).send({ message });
		}
	}
);

module.exports = router;
