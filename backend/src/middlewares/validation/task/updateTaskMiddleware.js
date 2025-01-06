const { MESSAGE_UTIL, isValidDateString } = require("@utils");

const updateTaskMiddleware = (req, res, next) => {
	const {
		body: { deadLineDate },
		errors
	} = req;

	if (deadLineDate && !isValidDateString(deadLineDate)) {
		errors["deadLineDate"] = [
			MESSAGE_UTIL.ERRORS.INVALID_DATE_STRING("deadLineDate")
		];
	}

	if (Object.keys(errors).length) {
		return res.status(400).send({
			message: errors
		});
	}

	delete req.errors;
	return next();
};

module.exports = updateTaskMiddleware;
