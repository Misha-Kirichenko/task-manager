const authController = require("./authController");
const userController = require("./userController");
const adminController = require("./adminController");
const projectController = require("./projectController");
const managerController = require("./managerController");
const taskController = require('./taskController');

module.exports = {
	authController,
	userController,
	adminController,
	managerController,
	projectController,
	taskController
};
