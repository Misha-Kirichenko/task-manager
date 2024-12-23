const faker = require("faker");
const { MAX_MANAGER_INDEX } = require("./constants");
const { ONE_DAY } = require("@constants/dateTime");

module.exports = (conn) => {
	const queryInterface = conn.getQueryInterface();
	return {
		up: async (amount) => {
			const MAX_YEARS_GAP = 5;
			const MIN_SENTENCE = 2;
			const MAX_SENTENCE = 8;

			const [[result]] = await queryInterface.sequelize.query(
				"SELECT COUNT(id) FROM projects;"
			);

			const { count: total } = result;
			if (total < amount) {
				const projectsToSeed = Math.abs(amount - total);
				const projects = [...Array(projectsToSeed)].map(() => {
					const minStartTimestamp = Date.now() - MAX_YEARS_GAP * 365 * ONE_DAY;
					const maxEndTimestamp = Date.now();

					const projectName = faker.unique(faker.commerce.productName);
					const sentenceCount =
						Math.floor(Math.random() * (MAX_SENTENCE - MIN_SENTENCE + 1)) +
						MIN_SENTENCE;
					const projectDescription = faker.lorem.sentences(sentenceCount);
					const randManagerInd = Math.floor(Math.random() * MAX_MANAGER_INDEX) + 1;

					let [startDate, endDate] = faker.date.betweens(
						new Date(minStartTimestamp).toISOString(),
						new Date(maxEndTimestamp).toISOString(),
						2
					);

					if (startDate.getTime() === endDate.getTime()) {
						endDate.setMilliseconds(
							endDate.getMilliseconds() + Math.floor(Math.random() * 1000)
						);
					}

					if (startDate.getTime() > endDate.getTime()) {
						[startDate, endDate] = [endDate, startDate];
					}

					startDate = startDate.getTime();
					endDate = Math.random() <= 0.2 ? endDate.getTime() : 0;

					return {
						projectName,
						projectDescription,
						managerId: randManagerInd,
						startDate,
						endDate
					};
				});
				console.log("Successfully executed projects seeder");
				return queryInterface.bulkInsert("projects", projects, {});
			}
			return;
		},
		down: () => {
			return queryInterface.bulkDelete("projects", null, {});
		}
	};
};
