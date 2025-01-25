const { Sequelize: DataTypes } = require("sequelize");
const { convertToEntities, mutateDates } = require("./hooks");

module.exports = (conn) => {
	const TaskReport = conn.define(
		"task_report",
		{
			id: {
				type: DataTypes.INTEGER,
				primaryKey: true,
				autoIncrement: true
			},
			taskId: {
				type: DataTypes.INTEGER,
				allowNull: false
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
		{
			timestamps: false,
			hooks: {
				beforeUpdate: (result) => {
					delete result.dataValues.createDate;
				},
				beforeSave: (result) => {
					convertToEntities(result, "reportText");
					convertToEntities(result, "managerResponse");
				},
				afterFind: (result) => mutateDates(result, "createDate")
			}
		}
	);
	return TaskReport;
};
