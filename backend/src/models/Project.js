const { Sequelize: DataTypes } = require("sequelize");
const convertToEntities = require("./hooks/convertToEntities");


module.exports = (conn) => {
	const Project = conn.define(
		"project",
		{
			id: {
				type: DataTypes.INTEGER,
				primaryKey: true,
				autoIncrement: true
			},
			projectName: { type: DataTypes.STRING, unique: true, allowNull: false },
			projectDescription: { type: DataTypes.TEXT, allowNull: false },
			endDate: { type: DataTypes.BIGINT, allowNull: false, defaultValue: 0 },
			managerId: {
				type: DataTypes.INTEGER,
				allowNull: true
			}
		},
		{
			timestamps: false,
			hooks: {
				beforeSave: convertToEntities
			}
		}
	);
	return Project;
};
