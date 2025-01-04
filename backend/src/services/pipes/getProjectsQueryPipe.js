const { Sequelize, Op } = require("sequelize");
const conn = require("@config/conn");
const { User } = require("@models")(conn);
const { SQL_USERS_EMPLOYED_QUERY } = require("@constants/sql");
const { STATUS } = require("@constants/status");

const getProjectsQueryPipe = (status, query) => {
	const USERS_EMPLOYED_QUERY = Sequelize.literal(SQL_USERS_EMPLOYED_QUERY);

	const DEFAULT_PAGE_SIZE = 10;
	const {
		page = 1,
		limit = DEFAULT_PAGE_SIZE,
		managerId,
		dateFrom = new Date(0).getTime(),
		dateTo = new Date(Date.now()).setHours(23, 59, 59),
		search = "",
		orderBy = status === STATUS[0] ? "startDate" : "endDate",
		orderDir = "DESC"
	} = query;

	const projectsQuery = {
		where: {
			...(managerId && { managerId }),
			[Op.or]: [
				{
					projectName: {
						[Op.iLike]: `%${search}%`
					}
				},
				{
					projectDescription: {
						[Op.iLike]: `%${search}%`
					}
				}
			],
			startDate: { [Op.gte]: dateFrom, [Op.lte]: dateTo },
			endDate:
				status === STATUS[0] ? 0 : { [Op.gt]: 0, [Op.lte]: dateTo }
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
		offset: (page - 1) * limit,
		limit,
		order: [[orderBy, orderDir]],
		attributes: {
			exclude: ["managerId", "projectDescription"],
			include: [[USERS_EMPLOYED_QUERY, "usersEmployed"]]
		}
	};

	return projectsQuery;
};

module.exports = getProjectsQueryPipe;
