const { Sequelize: DataTypes } = require("sequelize");
const ROLES = require("@constants/roles");

module.exports = (conn) => {
  const User = conn.define("user",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: { type: DataTypes.STRING, allowNull: false },
      surname: { type: DataTypes.STRING, allowNull: false },
      email: { type: DataTypes.STRING, unique: true, allowNull: false },
      password: { type: DataTypes.STRING, allowNull: false },
      role: { type: DataTypes.STRING, defaultValue: "USER", allowNull: false, isIn: [ROLES] },
      avatar: { type: DataTypes.STRING, allowNull: true, default: null },
      lastLogin: { type: DataTypes.BIGINT, allowNull: false, default: 0 },
    },
    { timestamps: false }
  );
  return User;
};