module.exports = (conn, DataTypes) => {
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
      role: { type: DataTypes.STRING, defaultValue: "USER", allowNull: false },
      avatar: { type: DataTypes.STRING, allowNull: true, default: null },
    },
    { timestamps: false }
  );
  return User;
};