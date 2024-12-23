const { Router } = require("express");

const { statusCodeMessage } = require("@utils");
const {
	verifyTokenMiddleware,
	checkRolesMiddleware
} = require("@middlewares/auth");
const { validatePasswordMiddleware } = require("@middlewares/validation");

module.exports = (Model, roles) => {
	const router = Router();
	const authService = require("@services/authService")(Model, roles);
	const profileService = require("@services/profileService")(Model);

	router.post("/login", async (req, res) => {
		try {
			const { login, password } = req.body;
			const answer = await authService.login(login, password);
			return res.send(answer);
		} catch (error) {
			console.log("auth error", error);
			const { status, message } = statusCodeMessage(error);
			return res.status(status).send({ message });
		}
	});

	router.get(
		"/profile",
		[verifyTokenMiddleware("access"), checkRolesMiddleware(roles)],
		async (req, res) => {
			try {
				const profile = await profileService.getProfile(
					req.user.login,
					req.user.role
				);
				return res.send(profile);
			} catch (error) {
				const { status, message } = statusCodeMessage(error);
				return res.status(status).send({ message });
			}
		}
	);

	router.patch(
		"/password",
		[
			verifyTokenMiddleware("access"),
			checkRolesMiddleware(roles),
			validatePasswordMiddleware
		],
		async (req, res) => {
			try {
				const answer = await profileService.updatePassword(
					req.user.login,
					req.user.role,
					req.body
				);
				return res.send(answer);
			} catch (error) {
				const { status, message } = statusCodeMessage(error);
				return res.status(status).send({ message });
			}
		}
	);

	return router;
};
