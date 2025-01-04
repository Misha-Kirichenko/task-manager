const { Sequelize: DataTypes } = require("sequelize");
const { convertToEntities } = require("./hooks");
const mutateDates = require("./hooks/mutateDates");

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
			startDate: {
				type: DataTypes.BIGINT,
				allowNull: false,
				defaultValue: Date.now
			},
			endDate: { type: DataTypes.BIGINT, allowNull: false, defaultValue: 0 },
			managerId: {
				type: DataTypes.INTEGER,
				allowNull: true
			}
		},
		{
			timestamps: false,
			hooks: {
				beforeSave: (result) => convertToEntities(result, "projectDescription"),
				afterFind: (result) => mutateDates(result, "startDate", "endDate")
			}
		}
	);
	return Project;
};
