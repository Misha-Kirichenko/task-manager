const { Sequelize } = require("sequelize");
const conn = require("@config/conn");
const { User, Project } = require("@models")(conn);

const getUserProjectsQueryPipe = (userId) => ({
	where: { userId, endDate: 0 },
	include: [
		{
			model: Project,
			as: "Project",
			where: {
				endDate: 0
			},
			attributes: ["id", "projectName", "startDate"],
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
			]
		}
	],
	order: [["Project", "startDate", "DESC"]],
	attributes: []
});

module.exports = getUserProjectsQueryPipe;
