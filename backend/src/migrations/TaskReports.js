const { Sequelize: DataTypes } = require("sequelize");
const { MIGRATION_UTIL, MESSAGE_UTIL } = require("@utils");

module.exports = (conn) => {
	const queryInterface = conn.getQueryInterface();
	return {
		up: async () => {
			const transaction = await conn.transaction();
			try {
				const [tableExists] = await queryInterface.sequelize.query(
					MIGRATION_UTIL.SELECT_TABLE("task_reports"),
					{ transaction }
				);

				if (!tableExists.length) {
					await queryInterface.createTable(
						"task_reports",
						{
							id: {
								type: DataTypes.INTEGER,
								primaryKey: true,
								autoIncrement: true
							},
							taskId: {
								type: DataTypes.INTEGER,
								allowNull: false,
								references: {
									model: "tasks",
									key: "id"
								}
							},
							createDate: {
								type: DataTypes.BIGINT,
								allowNull: false,
								defaultValue: Date.now
							},
							reportText: { type: DataTypes.TEXT, allowNull: false },
							managerResponse: {
								type: DataTypes.TEXT,
								allowNull: true,
								defaultValue: null
							},
							managerResponseDate: {
								type: DataTypes.BIGINT,
								allowNull: true,
								defaultValue: null
							}
						},
						{ timestamps: false },
						{ transaction }
					);

					console.log(MESSAGE_UTIL.SUCCESS.MIGRATION("task_reports"));
				}
				await transaction.commit();
			} catch (error) {
				await transaction.rollback();
				throw error;
			}
		},
		down: async () => {
			await queryInterface.dropTable("task_reports");
		}
	};
};
