const conn = require("@config/conn");
const { MESSAGE_UTIL, isValidDateString } = require("@utils");
const ORDER_DIRS = require("@constants/sqlOrderDir");
const { Project } = require("@models")(conn);
const MESSAGES = require("@constants/messages");

const getAllProjectsMiddleware = (req, res, next) => {
	try {
		const { rawAttributes: modelAttributes } = Project;

		delete modelAttributes.id;
		delete modelAttributes.managerId;

		const {
			page,
			limit,
			dateFrom,
			dateTo,
			orderBy,
			search,
			orderDir,
			managerId
		} = req.query;

		const errors = {};

		if (page && isNaN(Number(page))) {
			errors["page"] = [MESSAGE_UTIL.ERRORS.MUST_BE_OF_TYPE("page", "number")];
		}

		if (limit && isNaN(Number(limit))) {
			errors["limit"] = [
				MESSAGE_UTIL.ERRORS.MUST_BE_OF_TYPE("limit", "number")
			];
		}

		if (managerId && isNaN(Number(managerId))) {
			errors["managerId"] = [
				MESSAGE_UTIL.ERRORS.MUST_BE_OF_TYPE("managerId", "number")
			];
		}

		if (dateFrom && !isValidDateString(dateFrom)) {
			errors["dateFrom"] = [
				MESSAGE_UTIL.ERRORS.INVALID_DATE_STRING("dateFrom")
			];
		}

		if (dateTo && !isValidDateString(dateTo)) {
			errors["dateTo"] = [MESSAGE_UTIL.ERRORS.INVALID_DATE_STRING("dateTo")];
		}

		const [dateFromDate, dateToDate] = [new Date(dateFrom), new Date(dateTo)];

		if (dateFrom && dateTo && dateToDate < dateFromDate) {
			errors["dateTo"] = Boolean(errors["dateTo"])
				? [...errors["dateTo"], `dateTo must be greater than dateFrom`]
				: [`dateTo must be greater than dateFrom`];
		}

		if (req.query.hasOwnProperty("search") && !Boolean(search.trim())) {
			errors["search"] = [MESSAGE_UTIL.ERRORS.NO_VALUE("search")];
		}

		if (orderBy && !modelAttributes[orderBy]) {
			errors["orderBy"] = [MESSAGES.ERRORS.UNACCEPTABLE];
		}

		if (orderDir && !ORDER_DIRS.includes(orderDir.toUpperCase())) {
			errors["orderDir"] = [
				MESSAGE_UTIL.ERRORS.INVALID_FIELD(
					"orderDir",
					`one of: ${ORDER_DIRS.join(",")}`
				)
			];
		}

		if (Object.keys(errors).length) {
			return res.status(400).send({
				message: errors
			});
		}

		req.query.dateFrom
			? (req.query.dateFrom = new Date(dateFrom).setHours(0, 0, 0, 0))
			: null;

		req.query.dateTo
			? (req.query.dateTo = new Date(dateTo).setHours(23, 59, 59, 999))
			: null;

		return next();
	} catch (err) {
		return res
			.status(500)
			.json({ message: MESSAGES.ERRORS.INTERNAL_SERVER_ERROR });
	}
};

module.exports = getAllProjectsMiddleware;
