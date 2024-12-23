require("dotenv").config();
require("module-alias/register");

const conn = require("@config/conn");
const connectDB = require("@config/connectDB");
const {
	USERS_AMOUNT,
	PROJECTS_AMOUNT,
	USER_PROJECTS_AMOUNT
} = require("./constants");

connectDB(conn);

const usersSeeder = require("./Users")(conn);
const adminsSeeder = require("./Admins")(conn);
const projectsSeeder = require("./Projects")(conn);
const userProjectsSeeder = require("./UserProjects")(conn);

(async () => {
	try {
		const userSeeders = [usersSeeder.up(USERS_AMOUNT), adminsSeeder.up()];
		await Promise.all(userSeeders);

		await projectsSeeder.up(PROJECTS_AMOUNT);
		await userProjectsSeeder.up(USER_PROJECTS_AMOUNT);
	} catch (error) {
		console.error("seeding error:", error);
	}
})();
