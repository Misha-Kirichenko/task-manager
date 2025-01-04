const router = require("express").Router();
const {
	authController,
	userController,
	adminController,
	managerController,
	projectController,
	taskController
} = require("./controllers");

router.use("/auth", authController);
router.use("/admin", adminController);
router.use("/user", userController);
router.use("/manager", managerController);
router.use("/project", projectController);
router.use("/task", taskController);

module.exports = router;
