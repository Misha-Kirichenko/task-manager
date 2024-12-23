const bcrypt = require("bcrypt");

module.exports = (conn) => {
	const queryInterface = conn.getQueryInterface();
	return {
		up: async () => {
			const [[result]] = await queryInterface.sequelize.query(
				"SELECT COUNT (id) FROM admins;"
			);
			const { count: total } = result;
			//because postgres returns string
			if (total == 0) {
				const admins = [
					{
						name: "Admin",
						surname: "User",
						email: "admin_user@example.com",
						password: bcrypt.hashSync(
							"default123",
							parseInt(process.env.PASSWORD_SALT_ROUNDS)
						),
						root: false
					},
					{
						login: "root",
						password: bcrypt.hashSync(
							"rootPassword123",
							parseInt(process.env.PASSWORD_SALT_ROUNDS)
						),
						root: true
					}
				];
				console.log("Successfully executed admins seeder");
				return queryInterface.bulkInsert("admins", admins, {});
			}
			return;
		},
		down: () => {
			return queryInterface.bulkDelete("admins", null, {});
		}
	};
};
