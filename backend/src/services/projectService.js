const { QueryTypes } = require("sequelize");
const conn = require("@config/conn");
const { Project, User, UserProjects, Task } = require("@models")(conn);
const { SQL_USERS_WITH_ASSIGNED_FLAG } = require("@constants/sql");
const { USER_ROLES, ADMIN_ROLES } = require("@constants/roles");
const MESSAGES = require("@constants/messages");
const { STATUS } = require("@constants/status");
const { MESSAGE_UTIL, createHttpException } = require("@utils");
const { mutateDates } = require("@models/hooks");
const { getProjectsQueryPipe } = require("./pipes");

exports.getAllProjects = async (status, query) => {
	if (!STATUS.includes(status)) {
		const unprocessableException = createHttpException(
			422,
			MESSAGES.ERRORS.INVALID_PROJECT_STATUS
		);
		throw unprocessableException;
	}

	let foundProjectsPlain = [];
	const foundProjects = await Project.findAndCountAll(
		getProjectsQueryPipe(status, query)
	);

	const { count: total } = foundProjects;

	if (foundProjects.rows.length) {
		foundProjectsPlain = foundProjects.rows.map((project) => {
			const plainProject = project.get({ plain: true });
			return {
				projectId: plainProject.id,
				projectName: plainProject.projectName,
				startDate: plainProject.startDate,
				endDate: plainProject.endDate,
				usersEmployed: plainProject.usersEmployed,
				manager: plainProject.Manager.manager
			};
		});
	}

	return { data: foundProjectsPlain, total };
};

exports.getProject = async (id) => {
	const foundProject = await Project.findByPk(id, {
		attributes: { exclude: ["managerId"] },
		include: [
			{
				model: User,
				as: "Manager",
				attributes: { exclude: ["role", "password"] }
			}
		]
	});

	if (!foundProject) {
		const notFoundException = createHttpException(
			404,
			MESSAGE_UTIL.ERRORS.NOT_FOUND("Project")
		);
		throw notFoundException;
	}

	const plainFoundProject = foundProject.get({ plain: true });

	if (plainFoundProject.Manager) {
		mutateDates(plainFoundProject.Manager, "lastLogin");
	}

	return plainFoundProject;
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
	const foundProject = await Project.findByPk(id);

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

	if (endDateState) {
		const projectTasks = await Task.count({
			where: { projectId: id, completeDate: 0 }
		});

		if (projectTasks) {
			const unprocessableException = createHttpException(
				422,
				MESSAGES.ERRORS.HAS_ACTIVE_TASKS
			);

			throw unprocessableException;
		}
	}

	await Project.update({ endDate: endDateState }, { where: { id } });

	return { endDate: endDateState };
};

exports.toggleUsers = async (projectId, idArray = [], managerId = null) => {
	const foundProject = await Project.findOne(
		{ where: { id: projectId } },
		{
			attributes: ["id", "managerId", "endDate"]
		}
	);

	if (!foundProject) {
		const notFoundException = createHttpException(
			404,
			MESSAGE_UTIL.ERRORS.NOT_FOUND("Project")
		);
		throw notFoundException;
	}

	if (managerId && foundProject.managerId !== managerId) {
		const unprocessableException = createHttpException(
			422,
			MESSAGES.ERRORS.ASSIGN_USERS_TO_PROJECT
		);
		throw unprocessableException;
	}

	if (foundProject.endDate) {
		const unprocessableException = createHttpException(
			422,
			MESSAGES.ERRORS.TOGGLE_ON_ACTIVE
		);

		throw unprocessableException;
	}

	const transaction = await conn.transaction();

	try {
		await UserProjects.destroy({
			where: { projectId },
			transaction
		});

		if (idArray.length) {
			const foundUsers = await User.findAll(
				{
					where: { id: idArray, role: USER_ROLES[1] }
				},
				{ attributes: ["id"] }
			);

			if (foundUsers.length) {
				const userProjects = foundUsers.map((user) => ({
					userId: user.id,
					projectId
				}));

				await UserProjects.bulkCreate(userProjects, { transaction });
			}
		}

		await transaction.commit();
		return { message: MESSAGES.SUCCESS.OP_SUCCESS };
	} catch (error) {
		await transaction.rollback();
		throw error;
	}
};

exports.getProjectUsers = async (projectId, managerId = null) => {
	const searchObj = {
		id: projectId,
		...(managerId && { managerId })
	};

	const projectExists = await Project.count(searchObj);

	if (!projectExists) {
		const notFoundException = createHttpException(
			404,
			MESSAGE_UTIL.ERRORS.NOT_FOUND("Project")
		);
		throw notFoundException;
	}

	const users = await conn.query(SQL_USERS_WITH_ASSIGNED_FLAG, {
		bind: [projectId],
		type: QueryTypes.SELECT
	});

	return users;
};
