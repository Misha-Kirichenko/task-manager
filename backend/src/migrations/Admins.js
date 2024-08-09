const { Sequelize: DataTypes } = require("sequelize");
const { MIGRATION_UTIL, MESSAGE_UTIL } = require("@utils");

module.exports = (conn) => {
  const queryInterface = conn.getQueryInterface();
  return {
    up: async () => {
      const transaction = await conn.transaction();
      try {
        const [tableExists] = await queryInterface.sequelize.query(
          MIGRATION_UTIL.SELECT_TABLE("admins"),
          { transaction }
        );

        if (!tableExists.length) {
          await queryInterface.createTable("admins", {
            id: {
              type: DataTypes.INTEGER,
              primaryKey: true,
              autoIncrement: true,
            },
            name: { type: DataTypes.STRING, allowNull: true },
            surname: { type: DataTypes.STRING, allowNull: true },
            login: { type: DataTypes.STRING, allowNull: true, unique: true, defaultValue: null },
            email: { type: DataTypes.STRING, unique: true, allowNull: true },
            password: { type: DataTypes.STRING, allowNull: false },
            root: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
          }, { transaction });
          console.log(MESSAGE_UTIL.SUCCESS.MIGRATION("admins"));
        }
        await transaction.commit();
      } catch (error) {
        await transaction.rollback();
        throw error;
      }
    },
    down: async () => {
      await queryInterface.dropTable("admins");
    }
  }
};