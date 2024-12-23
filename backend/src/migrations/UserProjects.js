const { Sequelize: DataTypes } = require("sequelize");
const { MIGRATION_UTIL, MESSAGE_UTIL } = require("@utils");

module.exports = (conn) => {
	const queryInterface = conn.getQueryInterface();
	return {
		up: async () => {
			const transaction = await conn.transaction();
			try {
				const [tableExists] = await queryInterface.sequelize.query(
					MIGRATION_UTIL.SELECT_TABLE("user_projects"),
					{ transaction }
				);

				if (!tableExists.length) {
					await queryInterface.createTable(
						"user_projects",
						{
							id: {
								type: DataTypes.INTEGER,
								primaryKey: true,
								autoIncrement: true
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
							userId: {
								type: DataTypes.INTEGER,
								allowNull: false,
								references: {
									model: "users",
									key: "id"
								},
								onUpdate: "CASCADE",
								onDelete: "CASCADE"
							}
						},
						{ transaction }
					);

					await queryInterface.addIndex(
						"user_projects",
						["userId", "projectId"],
						{
							unique: true,
							transaction
						}
					);

					await queryInterface.addIndex("user_projects", ["projectId"], {
						unique: false,
						using: "HASH",
						transaction
					});

					console.log(MESSAGE_UTIL.SUCCESS.MIGRATION("user_projects"));
				}
				await transaction.commit();
			} catch (error) {
				await transaction.rollback();
				throw error;
			}
		},
		down: async () => {
			await queryInterface.dropTable("user_projects");
		}
	};
};
