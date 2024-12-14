module.exports = (conn) => {
	const User = require("./User")(conn); // или импортируйте модель другим способом
	const Project = require("./Project")(conn);
	const Admin = require("./Admin")(conn);
	const UserProjects = require("./UserProjects")(conn);

	User.hasMany(Project, { foreignKey: "managerId" });
	Project.belongsTo(User, { foreignKey: "managerId", onDelete: "SET NULL" });

	User.belongsToMany(Project, {
		through: UserProjects,
		foreignKey: "userId",
		otherKey: "projectId",
		onDelete: "CASCADE"
	});

	Project.belongsToMany(User, {
		through: UserProjects,
		foreignKey: "projectId",
		otherKey: "userId",
		onDelete: "CASCADE"
	});

	return {
		User,
		Admin,
		Project,
		UserProjects
	};
};
