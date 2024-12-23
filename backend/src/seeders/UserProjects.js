const {
	USERS_AMOUNT,
	PROJECTS_AMOUNT,
	MAX_MANAGER_INDEX
} = require("./constants");

module.exports = (conn) => {
	const queryInterface = conn.getQueryInterface();

	const generateUniquePair = (existingKeys) => {
		let randUserId, randProjectId, hashKey;

		do {
			const userRandNum = Math.floor(Math.random() * USERS_AMOUNT) + 1;
			randUserId =
				userRandNum > MAX_MANAGER_INDEX
					? userRandNum
					: userRandNum + MAX_MANAGER_INDEX;

			randProjectId = Math.floor(Math.random() * PROJECTS_AMOUNT) + 1;
			hashKey = `${randUserId}:${randProjectId}`;
		} while (existingKeys[hashKey]);

		return { userId: randUserId, projectId: randProjectId, hashKey };
	};

	return {
		up: async (amount) => {
			const userProjectHash = {};
			const [result] = await queryInterface.sequelize.query(
				"SELECT * FROM user_projects;"
			);
			if (result.length < amount) {
				if (result.length > 0) {
					for (const userProject of result) {
						const { userId, projectId } = userProject;
						const hashKey = `${userId}:${projectId}`;
						userProjectHash[hashKey] = true;
					}
				}
				const userProjectsToSeed = Math.abs(amount - result.length);
				const userProjects = Array.from({ length: userProjectsToSeed }, () => {
					const { userId, projectId, hashKey } =
						generateUniquePair(userProjectHash);
					userProjectHash[hashKey] = true;
					return { userId, projectId };
				});

				console.log("Successfully executed user_projects seeder");
				return queryInterface.bulkInsert("user_projects", userProjects, {});
			}
			return;
		},
		down: () => {
			return queryInterface.bulkDelete("user_projects", null, {});
		}
	};
};
