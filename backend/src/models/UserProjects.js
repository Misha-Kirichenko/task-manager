const { Sequelize: DataTypes } = require("sequelize");

module.exports = (conn) => {
	const UserProjects = conn.define(
		"user_projects",
		{
			id: {
				type: DataTypes.INTEGER,
				primaryKey: true,
				autoIncrement: true
			},
			userId: {
				type: DataTypes.INTEGER,
				allowNull: false
			},
			projectId: {
				type: DataTypes.INTEGER,
				allowNull: false
			}
		},
		{
			timestamps: false,
			indexes: [
				{
					unique: true,
					fields: ["userId", "projectId"]
				}
			]
		}
	);
	return UserProjects;
};
