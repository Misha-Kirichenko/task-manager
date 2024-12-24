const conn = require("@config/conn");
const { Sequelize, Op } = require("sequelize");
const { Project, User, UserProjects } = require("@models")(conn);
const { USER_ROLES, ADMIN_ROLES } = require("@constants/roles");
const MESSAGES = require("@constants/messages");
const { PROJECT_STATUS } = require("@constants/projectStatus");
const { SQL_USERS_EMPLOYED_QUERY } = require("@constants/sql");
const { MESSAGE_UTIL, createHttpException } = require("@utils");
const { mutateDates } = require("@models/hooks");

exports.getProject = async (projectId, { role, userId }) => {
	const whereClause = {
		id: projectId,
		...(!ADMIN_ROLES.includes(role) &&
			role === USER_ROLES[0] && { managerId: userId })
	};

	const includeClause = [
		...(ADMIN_ROLES.includes(role) || role === USER_ROLES[1]
			? [
					{
						model: User,
						as: "Manager",
						attributes: { exclude: ["role", "password"] }
					}
			  ]
			: [])
	];

	if (role === USER_ROLES[1]) {
		const userProjectExists = await UserProjects.count({
			where: {
				userId,
				projectId
			}
		});

		if (!userProjectExists) {
			const notFoundException = createHttpException(
				404,
				MESSAGE_UTIL.ERRORS.NOT_FOUND("Project")
			);
			throw notFoundException;
		}
	}

	const foundProject = await Project.findOne({
		where: whereClause,
		attributes: { exclude: ["managerId"] },
		...(includeClause.length && { include: includeClause })
	});

	if (!foundProject) {
		const notFoundException = createHttpException(
			404,
			MESSAGE_UTIL.ERRORS.NOT_FOUND("Project")
		);
		throw notFoundException;
	}

	if (foundProject.Manager) {
		mutateDates(foundProject.Manager, "lastLogin");
	}

	return foundProject;
};

exports.getAllProjects = async (status, query) => {
	const DEFAULT_PAGE_SIZE = 10;
	if (!PROJECT_STATUS.includes(status)) {
		const unprocessableException = createHttpException(
			422,
			MESSAGES.ERRORS.INVALID_PROJECT_STATUS
		);
		throw unprocessableException;
	}

	let {
		page = 1,
		limit = DEFAULT_PAGE_SIZE,
		managerId,
		dateFrom = new Date(0).getTime(),
		dateTo = new Date(Date.now()).setHours(23, 59, 59),
		search = "",
		orderBy = status === PROJECT_STATUS[0] ? "startDate" : "endDate",
		orderDir = "DESC"
	} = query;

	const USERS_EMPLOYED_QUERY = Sequelize.literal(SQL_USERS_EMPLOYED_QUERY);

	const foundProjects = await Project.findAndCountAll({
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
				status === PROJECT_STATUS[0] ? 0 : { [Op.gt]: 0, [Op.lte]: dateTo }
		},
		include: [
			{
				model: User,
				as: "Manager",
				attributes: { exclude: ["role", "password"] }
			}
		],
		offset: (page - 1) * limit,
		limit,
		order: [[orderBy, orderDir]],
		attributes: {
			exclude: ["managerId", "projectDescription"],
			include: [[USERS_EMPLOYED_QUERY, "usersEmployed"]]
		}
	});

	if (foundProjects.rows.length) {
		foundProjects.rows.forEach((project) => {
			if (project.Manager) {
				mutateDates(project.Manager, "lastLogin");
			}
		});
	}

	return { data: foundProjects.rows, total: foundProjects.count };
};

exports.createProject = async (body) => {
	if (body.managerId) {
		const foundUser = await User.findByPk(body.managerId, {
			attributes: ["role"]
		});

		if (!foundUser) {
			const badRequestException = createHttpException(
				400,
				MESSAGES.ERRORS.UNKNOWN_USER
			);
			throw badRequestException;
		}

		if (foundUser.role !== USER_ROLES[0]) {
			const badRequestException = createHttpException(
				400,
				MESSAGES.ERRORS.ACCEPT_MANAGER
			);
			throw badRequestException;
		}
	}

	await Project.create(body);
	return { message: MESSAGE_UTIL.SUCCESS.CREATED("Project") };
};

exports.updateProject = async (id, body) => {
	const foundProject = await Project.findByPk(id, {
		attributes: ["id"]
	});

	if (!foundProject) {
		const notFoundException = createHttpException(
			404,
			MESSAGE_UTIL.ERRORS.NOT_FOUND("Project")
		);
		throw notFoundException;
	}

	if (body.managerId) {
		const foundUser = await User.findByPk(body.managerId, {
			attributes: ["role"]
		});

		if (foundUser.role !== USER_ROLES[0]) {
			const badRequestException = createHttpException(
				400,
				MESSAGES.ERRORS.ACCEPT_MANAGER
			);
			throw badRequestException;
		}
	}

	for (const field in body) {
		foundProject[field] = body[field];
	}

	await foundProject.save();

	return { message: MESSAGE_UTIL.SUCCESS.UPDATED("Project's data") };
};

exports.toggle = async (userData, id) => {
	const foundProject = await Project.findByPk(id, {
		attributes: ["id", "endDate", "managerId"]
	});

	if (!foundProject) {
		const notFoundException = createHttpException(
			404,
			MESSAGE_UTIL.ERRORS.NOT_FOUND("Project")
		);
		throw notFoundException;
	}

	const { managerId, endDate } = foundProject;

	if (!ADMIN_ROLES.includes(userData.role) && managerId !== userData.id) {
		const unprocessableException = createHttpException(
			422,
			MESSAGE_UTIL.ERRORS.PROJECT_ASSOC_MANAGER(
				foundProject.endDate ? "start" : "finish"
			)
		);

		throw unprocessableException;
	}

	const endDateState = endDate ? 0 : Date.now();
	foundProject.endDate = endDateState;

	await foundProject.save();

	return { endDate: endDateState };
};
