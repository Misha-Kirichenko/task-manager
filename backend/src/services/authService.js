const bcrypt = require("bcrypt");
const { Op } = require("sequelize");
const { createHttpException, generateTokenPairs } = require("@utils");
const conn = require("@config/conn");
const { User, Admin } = require("@models")(conn);
const { ADMIN_ROLES } = require("@constants/roles");
const MESSAGES = require("@constants/messages");

exports.login = async (login, password) => {
	if (!login || !password) {
		const badRequestException = createHttpException(
			400,
			MESSAGES.ERRORS.ALL_FIELDS_REQUIRED
		);
		throw badRequestException;
	}

	const foundUser = await User.scope("withPassword").findOne({
		where: {
			email: login
		}
	});

	if (foundUser) {
		const passwordsMatch = await bcrypt.compare(password, foundUser.password);
		if (passwordsMatch) {
			const { id, role } = foundUser;
			const tokenPairs = generateTokenPairs({
				id,
				login,
				role
			});

			//check on undefined, because lastLogin can be 0, and if admin model passed it will be undefined
			if (foundUser.lastLogin !== undefined) {
				foundUser.lastLogin = Date.now();
			}

			await foundUser.save();
			return tokenPairs;
		}
	}

	const foundAdmin = await Admin.scope("withPassword").findOne({
		where: {
			[Op.or]: { email: login, login }
		}
	});

	if (foundAdmin) {
		const passwordsMatch = await bcrypt.compare(password, foundAdmin.password);
		if (passwordsMatch) {
			const { id, root } = foundAdmin;
			const tokenPairs = generateTokenPairs({
				id,
				login,
				role: root ? ADMIN_ROLES[0] : ADMIN_ROLES[1]
			});

			return tokenPairs;
		}
	}

	const unauthorizedException = createHttpException(
		401,
		MESSAGES.ERRORS.UNAUTHORIZED
	);
	throw unauthorizedException;
};
