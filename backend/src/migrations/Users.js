const { Sequelize: DataTypes } = require("sequelize");
const ROLES = require("@constants/roles");
const { MIGRATION_UTIL, MESSAGE_UTIL } = require("@utils");

module.exports = (conn) => {
  const queryInterface = conn.getQueryInterface();
  return {
    up: async () => {
      const transaction = await conn.transaction();
      try {
        const [tableExists] = await queryInterface.sequelize.query(
          MIGRATION_UTIL.SELECT_TABLE("users"),
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
            avatar: { type: DataTypes.STRING, allowNull: true, defaultValue: null },
            lastLogin: { type: DataTypes.BIGINT, allowNull: false, defaultValue: 0 },
          }, { transaction });
          console.log(MESSAGE_UTIL.SUCCESS.MIGRATION("users"));
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