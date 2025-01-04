const { MESSAGE_UTIL, isValidDateString } = require("@utils");

const createTaskMiddleware = (req, res, next) => {
	const {
		body: { deadLineDate },
		errors
	} = req;

	if (!isValidDateString(deadLineDate)) {
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

module.exports = createTaskMiddleware;
