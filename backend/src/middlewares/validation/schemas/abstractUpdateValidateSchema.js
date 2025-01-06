const { validateWithModelFields, MESSAGE_UTIL } = require("@utils");

const abstractUpdateValidateSchema =
	(Model, excludeFields = []) =>
	(req, res, next) => {
		try {
			const errors = {};

			const { rawAttributes: modelAttributes } = Model;

			const passedFieldsCopy = { ...req.body };

			if (excludeFields.length) {
				for (const field of excludeFields) {
					delete passedFieldsCopy[field];
					delete modelAttributes[field];
				}
			}

			for (const field in passedFieldsCopy) {
				if (!modelAttributes[field]) {
					return res
						.status(400)
						.send({ message: MESSAGE_UTIL.ERRORS.UNACCEPTABLE(field) });
				}

				const { type, allowNull } = modelAttributes[field];

				if (
					passedFieldsCopy.hasOwnProperty(field) &&
					!passedFieldsCopy[field] &&
					!allowNull
				) {
					errors[field] = [MESSAGE_UTIL.ERRORS.NO_VALUE(field)];
				} else if (
					allowNull &&
					!validateWithModelFields(passedFieldsCopy[field], type) &&
					passedFieldsCopy[field] !== null
				) {
					errors[field] = [
						`${MESSAGE_UTIL.ERRORS.INVALID_TYPE(field, type)}${
							Boolean(passedFieldsCopy[field]) ? " or null" : ""
						}`
					];
				}
			}

			req.errors = errors;

			return next();
		} catch (err) {
			return res.status(500).json({ message: ERRORS.INTERNAL_SERVER_ERROR });
		}
	};

module.exports = abstractUpdateValidateSchema;
