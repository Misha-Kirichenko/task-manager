const { Sequelize } = require("sequelize");
const conn = require("@config/conn");
const { mutateDates } = require("@models/hooks");
const { User, Project, UserProjects } = require("@models")(conn);

exports.getMyProjects = async (userId) => {
	const projects = await UserProjects.findAll({
		where: {
			userId: userId
		},
		include: [
			{
				model: Project,
				as: "Project",
				where: {
					endDate: 0
				},
				include: [
					{
						model: User,
						as: "Manager",
						attributes: [
							[
								Sequelize.fn(
									"CONCAT",
									Sequelize.col("name"),
									" ",
									Sequelize.col("surname")
								),
								"manager"
							]
						]
					}
				],
				attributes: ["id", "projectName", "startDate"]
			}
		],
		order: [["Project", "startDate", "DESC"]]
	});

	const projectsList = projects.map((project) => {
		const mutatedProject = {
			projectId: project.Project.id,
			projectName: project.Project.projectName,
			startDate: project.Project.startDate,
			manager: project.Project.Manager.manager
		};

		mutateDates(mutatedProject);
		return mutatedProject;
	});

	return projectsList;
};
