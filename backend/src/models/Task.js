const { Sequelize: DataTypes } = require("sequelize");
const {
	convertToEntities,
	mutateDates,
	convertToTimestamp
} = require("./hooks");

module.exports = (conn) => {
	const Task = conn.define(
		"task",
		{
			id: {
				type: DataTypes.INTEGER,
				primaryKey: true,
				autoIncrement: true
			},
			taskName: { type: DataTypes.STRING, unique: true, allowNull: false },
			taskDescription: { type: DataTypes.TEXT, allowNull: false },
			userId: {
				type: DataTypes.INTEGER,
				allowNull: true
			},
			projectId: {
				type: DataTypes.INTEGER,
				allowNull: false,
				defaultValue: null
			},
			createDate: {
				type: DataTypes.BIGINT,
				allowNull: false,
				defaultValue: Date.now
			},
			deadLineDate: { type: DataTypes.BIGINT, allowNull: false },
			completeDate: {
				type: DataTypes.BIGINT,
				allowNull: false,
				defaultValue: 0
			}
		},
		{
			timestamps: false,
			hooks: {
				beforeUpdate: (result) => {
					delete result.dataValues.createDate;
				},
				beforeSave: (result) => {
					convertToEntities(result, "taskDescription");
					convertToTimestamp(result, "deadLineDate", "completeDate");
				},
				afterFind: (result) =>
					mutateDates(result, "createDate", "deadLineDate", "completeDate")
			}
		}
	);
	return Task;
};
