const { Sequelize: DataTypes } = require("sequelize");
const modifyEmail = require("./hooks/modifyEmail");
const { USER_ROLES } = require("@constants/roles");

module.exports = (conn) => {
	const User = conn.define(
		"user",
		{
			id: {
				type: DataTypes.INTEGER,
				primaryKey: true,
				autoIncrement: true
			},
			name: { type: DataTypes.STRING, allowNull: false },
			surname: { type: DataTypes.STRING, allowNull: false },
			email: { type: DataTypes.STRING, unique: true, allowNull: false },
			password: { type: DataTypes.STRING, allowNull: false },
			role: {
				type: DataTypes.STRING,
				defaultValue: USER_ROLES[1],
				allowNull: false,
				isIn: [USER_ROLES]
			},
			avatar: { type: DataTypes.STRING, allowNull: true, defaultValue: null },
			lastLogin: { type: DataTypes.BIGINT, allowNull: false, defaultValue: 0 }
		},
		{
			timestamps: false,
			hooks: {
				beforeSave: modifyEmail
			},
			defaultScope: {
				attributes: { exclude: ["password"] }
			},
			scopes: {
				withPassword: {
					attributes: {}
				}
			}
		}
	);
	return User;
};
