const router = require("express").Router();
const authController = require("./controllers/authController");
const userController = require("./controllers/userController");
const adminController = require("./controllers/adminController");

router.use("/auth", authController);
router.use("/user", userController);
router.use("/admin", adminController);

module.exports = router;