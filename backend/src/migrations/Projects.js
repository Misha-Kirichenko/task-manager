const { Sequelize: DataTypes } = require("sequelize");
const { MIGRATION_UTIL, MESSAGE_UTIL } = require("@utils");

module.exports = (conn) => {
  const queryInterface = conn.getQueryInterface();
  return {
    up: async () => {
      const transaction = await conn.transaction();
      try {
        const [tableExists] = await queryInterface.sequelize.query(
          MIGRATION_UTIL.SELECT_TABLE("projects"),
          { transaction }
        );

        if (!tableExists.length) {
          await queryInterface.createTable("projects", {
            id: {
              type: DataTypes.INTEGER,
              primaryKey: true,
              autoIncrement: true,
            },
            projectName: { type: DataTypes.STRING, unique: true, allowNull: false },
            projectDescription: { type: DataTypes.TEXT, allowNull: false },
            picture: { type: DataTypes.STRING, allowNull: true, defaultValue: null },
            endDate: { type: DataTypes.BIGINT, allowNull: false, defaultValue: 0 },
            managerId: {
              type: DataTypes.INTEGER,
              allowNull: true,
              references: {
                model: 'users',
                key: 'id'
              },
              onUpdate: 'CASCADE',
              onDelete: 'SET NULL'
            }
          }, { timestamps: false }, { transaction });
          console.log(MESSAGE_UTIL.SUCCESS.MIGRATION("projects"));
        }
        await transaction.commit();
      } catch (error) {
        await transaction.rollback();
        throw error;
      }
    },
    down: async () => {
      await queryInterface.dropTable("projects");
    }
  }
};