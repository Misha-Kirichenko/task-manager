const { Sequelize: DataTypes } = require("sequelize");

module.exports = (conn) => {
  const Admin = conn.define("admin",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: { type: DataTypes.STRING, allowNull: true, defaultValue: null },
      surname: { type: DataTypes.STRING, allowNull: true, defaultValue: null },
      login: { type: DataTypes.STRING, allowNull: true, unique: true, defaultValue: null },
      email: { type: DataTypes.STRING, unique: true, allowNull: true },
      password: { type: DataTypes.STRING, allowNull: false },
      root: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    },
    {
      timestamps: false,
      hooks: {
        beforeSave: (user) => {
          if (user.email) {
            user.email = user.email.toLowerCase();
          }
        },
      },
    }
  );
  return Admin;
};