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
			complete: {
				type: DataTypes.BOOLEAN,
				allowNull: false,
				defaultValue: false
			}
		},
		{
			timestamps: false,
			hooks: {
				beforeSave: (result) => {
					convertToEntities(result, "taskDescription");
					convertToTimestamp(result, "deadLineDate");
				},
				afterFind: (result) => mutateDates(result, "createDate", "deadLineDate")
			}
		}
	);
	return Task;
};
