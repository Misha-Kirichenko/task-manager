const router = require("express").Router();
const {
	authController,
	userController,
	adminController,
	projectController
} = require("./controllers");

router.use("/auth", authController);
router.use("/admin", adminController);
router.use("/user", userController);
router.use("/project", projectController);

module.exports = router;
