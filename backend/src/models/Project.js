const { Sequelize: DataTypes } = require("sequelize");
const he = require("he");

module.exports = (conn) => {
  const Project = conn.define("project",
    {
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
      },
    },
    {
      timestamps: false,
      hooks: {
        beforeSave: (project) => {
          if (project.projectDescription) {
            project.projectDescription = he.encode(project.projectDescription);
          }
        },
      }
    }
  );
  return Project;
};