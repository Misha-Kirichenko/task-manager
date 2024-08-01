const { Sequelize: DataTypes } = require("sequelize");
const ROLES = require("@constants/roles");

module.exports = (conn) => {
  const queryInterface = conn.getQueryInterface();
  return {
    up: async () => {
      const transaction = await conn.transaction();
      try {
        const [tableExists] = await queryInterface.sequelize.query(
          `SELECT * FROM information_schema.tables WHERE table_name = 'users'`,
          { transaction }
        );

        if (!tableExists.length) {
          await queryInterface.createTable("users", {
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
          }, { transaction });
          console.log("Successfully executed users migrations");
        }
        await transaction.commit();
      } catch (error) {
        await transaction.rollback();
        throw error;
      }
    },
    down: async () => {
      await queryInterface.dropTable("users");
    }
  }
};