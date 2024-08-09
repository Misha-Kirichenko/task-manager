module.exports = (conn) => {
  const User = require('./User')(conn); // или импортируйте модель другим способом
  const Project = require('./Project')(conn);
  const Admin = require("./Admin")(conn);

  User.hasMany(Project, { foreignKey: 'managerId' });
  Project.belongsTo(User, { foreignKey: 'managerId' });

  return {
    User,
    Admin,
    Project
  }
};