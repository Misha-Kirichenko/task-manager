module.exports = {
	ERRORS: {
		NOT_FOUND: (field) => `${field} was not found`,
		INVALID_FIELD: (field, conditions) =>
			`${field} is invalid, it must ${conditions}`,
		REQUIRED: (field) => `${field} is required`,
		NO_VALUE: (field) => `${field} can't be empty`,
		INVALID_TYPE: (field, type) => `${field} must be of type ${type.key}`,
		MUST_BE_OF_TYPE: (field, type) =>
			`${field} has invalid type. It must be of type ${type}.`,
		UNACCEPTABLE: (field) => `field '${field}' is unacceptable!`,
		PROJECT_ASSOC_MANAGER: (status) =>
			`Only associated manager can ${status} this project`,
		INVALID_DATE_STRING: (field) => `${field} is invalid date string`
	},
	SUCCESS: {
		UPDATED: (field) => `${field} was successfully updated`,
		CREATED: (data) => `${data} was successfully created`,
		DELETED: (data) => `${data} was successfully deleted`,
		MIGRATION: (data) => `Successfully executed ${data} migration`,
		TOGGLE_TASK: (status) =>
			`Task was successfully set to ${status ? "complete" : "active"} status`,
	}
};
