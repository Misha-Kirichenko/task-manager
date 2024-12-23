const conn = require("@config/conn");
const { QueryTypes } = require("sequelize");
const { SQL_USERS_WITH_ASSIGNED_FLAG } = require("@constants/sql");
const MESSAGES = require("@constants/messages");
const { MESSAGE_UTIL, createHttpException } = require("@utils");
const { USER_ROLES } = require("@constants/roles");
const { Project, User, UserProjects } = require("@models")(conn);

exports.getMyProjects = async (userId) => {
	const projectList = await Project.findAll({
		where: { managerId: userId },
		attributes: [["id", "projectId"], "projectName", "startDate"],
		order: [["startDate", "DESC"]]
	});
	return projectList;
};

exports.getProjectUsers = async (projectId, managerId) => {
	const projectExists = await Project.count({
		where: { id: projectId, managerId }
	});

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

exports.toggleUsers = async (managerId, projectId, idArray = []) => {
	const foundProject = await Project.findByPk(projectId, {
		attributes: ["id", "managerId"]
	});

	if (!foundProject) {
		const notFoundException = createHttpException(
			404,
			MESSAGE_UTIL.ERRORS.NOT_FOUND("Project")
		);
		throw notFoundException;
	}

	if (foundProject.managerId !== managerId) {
		const unprocessableException = createHttpException(
			422,
			MESSAGES.ERRORS.ASSIGN_USERS_TO_PROJECT
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
		return { message: `Operation was successful!` };
	} catch (error) {
		await transaction.rollback();
		throw error;
	}
};
