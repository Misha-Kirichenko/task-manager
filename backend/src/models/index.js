module.exports = (conn) => {
	const User = require("./User")(conn);
	const Project = require("./Project")(conn);
	const Admin = require("./Admin")(conn);
	const UserProjects = require("./UserProjects")(conn);
	const Task = require("./Task")(conn);
	const TaskReport = require("./TaskReport")(conn);

	User.hasMany(UserProjects, {
		foreignKey: "userId",
		as: "UserProjects",
		onDelete: "CASCADE"
	});
	UserProjects.belongsTo(User, {
		foreignKey: "userId",
		as: "User",
		onDelete: "CASCADE"
	});

	Project.hasMany(UserProjects, {
		foreignKey: "projectId",
		as: "UserProjects",
		onDelete: "CASCADE"
	});
	UserProjects.belongsTo(Project, {
		foreignKey: "projectId",
		as: "Project",
		onDelete: "CASCADE"
	});

	User.belongsToMany(Project, {
		through: UserProjects,
		foreignKey: "userId",
		otherKey: "projectId",
		as: "Projects",
		onDelete: "CASCADE"
	});

	Project.belongsToMany(User, {
		through: UserProjects,
		foreignKey: "projectId",
		otherKey: "userId",
		as: "Users",
		onDelete: "CASCADE"
	});

	User.hasMany(Project, {
		as: "ManagedProjects",
		foreignKey: "managerId",
		onDelete: "SET NULL"
	});
	Project.belongsTo(User, {
		foreignKey: "managerId",
		onDelete: "SET NULL",
		as: "Manager"
	});

	Task.belongsTo(Project, {
		foreignKey: "projectId",
		onDelete: "CASCADE",
		as: "TaskProject"
	});

	Task.belongsTo(User, {
		foreignKey: "userId",
		onDelete: "CASCADE",
		as: "TaskUser"
	});

	TaskReport.belongsTo(Task, {
		foreignKey: "taskId",
		onDelete: "CASCADE",
		as: "TaskReportTask"
	});


	return {
		User,
		Admin,
		Project,
		UserProjects,
		Task,
		TaskReport
	};
};
