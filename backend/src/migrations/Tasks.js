const { Sequelize: DataTypes } = require("sequelize");
const { MIGRATION_UTIL, MESSAGE_UTIL } = require("@utils");

module.exports = (conn) => {
	const queryInterface = conn.getQueryInterface();
	return {
		up: async () => {
			const transaction = await conn.transaction();
			try {
				const [tableExists] = await queryInterface.sequelize.query(
					MIGRATION_UTIL.SELECT_TABLE("tasks"),
					{ transaction }
				);

				if (!tableExists.length) {
					await queryInterface.createTable(
						"tasks",
						{
							id: {
								type: DataTypes.INTEGER,
								primaryKey: true,
								autoIncrement: true
							},
							taskName: {
								type: DataTypes.STRING,
								unique: true,
								allowNull: false
							},
							taskDescription: { type: DataTypes.TEXT, allowNull: false },
							userId: {
								type: DataTypes.INTEGER,
								allowNull: false,
								references: {
									model: "users",
									key: "id"
								},
								onUpdate: "CASCADE",
								onDelete: "CASCADE"
							},
							completeDate: {
								type: DataTypes.BIGINT,
								allowNull: false,
								defaultValue: 0
							},
							projectId: {
								type: DataTypes.INTEGER,
								allowNull: false,
								references: {
									model: "projects",
									key: "id"
								},
								onUpdate: "CASCADE",
								onDelete: "CASCADE"
							},
							createDate: {
								type: DataTypes.BIGINT,
								allowNull: false,
								defaultValue: Date.now
							},
							deadLineDate: { type: DataTypes.BIGINT, allowNull: false }
						},
						{ timestamps: false },
						{ transaction }
					);
					console.log(MESSAGE_UTIL.SUCCESS.MIGRATION("tasks"));
				}
				await transaction.commit();
			} catch (error) {
				await transaction.rollback();
				throw error;
			}
		},
		down: async () => {
			await queryInterface.dropTable("tasks");
		}
	};
};
