const router = require("express").Router();
const { authController, userController, adminController } = require("./controllers");

router.use("/auth", authController);
router.use("/user", userController);
router.use("/admin", adminController);

module.exports = router;
