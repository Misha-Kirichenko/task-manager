const bcrypt = require("bcrypt");
const conn = require("@config/conn");
const { User } = require("@models")(conn);
const { MESSAGE_UTIL, createHttpException } = require("@utils");
const MESSAGES = require("@constants/messages");
const { USER_ROLES } = require("@constants/roles");

exports.changeUserRole = async (id, role) => {
	const foundUser = await User.findByPk(id, {
		attributes: ["id", "role"]
	});

	if (!foundUser) {
		const notFoundException = createHttpException(
			404,
			MESSAGE_UTIL.ERRORS.NOT_FOUND("User")
		);
		throw notFoundException;
	}

	foundUser.role = role;
	await foundUser.save();

	return { message: MESSAGES.SUCCESS.ROLE_CHANGED };
};

exports.updateUser = async (id, body) => {
	const foundUser = await User.findByPk(id, {
		attributes: ["id"]
	});

	if (!foundUser) {
		const notFoundException = createHttpException(
			404,
			MESSAGE_UTIL.ERRORS.NOT_FOUND("User")
		);
		throw notFoundException;
	}

	if (body.password) {
		const { password } = body;
		delete body.password;
		const hashedPassword = await bcrypt.hash(
			password,
			parseInt(process.env.PASSWORD_SALT_ROUNDS)
		);
		foundUser.password = hashedPassword;
	}

	for (const field in body) {
		foundUser[field] = body[field];
	}

	await foundUser.save();

	return { message: MESSAGE_UTIL.SUCCESS.UPDATED("User's data") };
};

exports.createUser = async (body) => {
	const hashedPassword = await bcrypt.hash(
		body.password,
		parseInt(process.env.PASSWORD_SALT_ROUNDS)
	);
	await User.create({ ...body, password: hashedPassword });
	return { message: MESSAGE_UTIL.SUCCESS.CREATED("User") };
};

exports.getUser = async (id) => {
	const foundUser = await User.findByPk(id);

	if (!foundUser) {
		const notFoundException = createHttpException(
			404,
			MESSAGE_UTIL.ERRORS.NOT_FOUND("User")
		);
		throw notFoundException;
	}

	return foundUser;
};

exports.getAllUsers = async (role) => {
	if (!USER_ROLES.includes(role)) {
		const unprocessableException = createHttpException(
			422,
			MESSAGE_UTIL.ERRORS.INVALID_FIELD(
				"role",
				`one of: ${USER_ROLES.join(",")}`
			)
		);
		throw unprocessableException;
	}

	const foundUsers = await User.findAll({ where: { role } });
	return foundUsers;
};
