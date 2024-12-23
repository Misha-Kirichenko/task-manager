const faker = require("faker");
const bcrypt = require("bcrypt");
const { MAX_MANAGER_INDEX } = require("./constants");

module.exports = (conn) => {
	const queryInterface = conn.getQueryInterface();
	return {
		up: async (amount) => {
			const [[result]] = await queryInterface.sequelize.query(
				"SELECT COUNT (id) FROM users;"
			);
			const { count: total } = result;

			if (total < amount) {
				const usersToSeed = Math.abs(amount - total);
				const users = [...Array(usersToSeed)].map((_, index) => {
					const name = faker.name.firstName();
					const surname = faker.name.lastName();
					const role = index < MAX_MANAGER_INDEX ? "MANAGER" : "USER";
					const lastLogin = faker.time.recent("unix");

					return {
						name,
						surname,
						role,
						email: faker.internet.email(name, surname).toLowerCase(),
						password: bcrypt.hashSync(
							"password123",
							parseInt(process.env.PASSWORD_SALT_ROUNDS)
						),
						lastLogin
					};
				});
				console.log("Successfully executed users seeder");
				return queryInterface.bulkInsert("users", users, {});
			}
			return;
		},
		down: () => {
			return queryInterface.bulkDelete("users", null, {});
		}
	};
};
