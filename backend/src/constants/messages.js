const { USER_ROLES } = require("./roles");

module.exports = {
	ERRORS: {
		INVALID_NAME:
			"contain only Latin letters and be between 2 and 50 characters long",
		INVALID_SURNAME:
			"start with a Latin letter, can contain only Latin letters, hyphens, apostrophes, and be between 2 and 50 characters long",
		INVALID_EMAIL: "be a valid email address (e.g., user@example.com)",
		INVALID_PROJECTNAME: "only contain letters, numbers, spaces, and commas",
		ALL_FIELDS_REQUIRED: "All fields are required",
		INTERNAL_SERVER_ERROR: "Internal Server Error",
		BAD_REQUEST: "Ooops...Something went wrong!",
		UNAUTHORIZED: "Invalid credentials",
		FORBIDDEN: "You have no access rights",
		INVALID_ROLE: `be one of next values: ${USER_ROLES.join(",")}`,
		NO_ROLE: "No role was passed",
		INCORRECT_PASSWORD: "Current password is incorrect",
		ACCEPT_MANAGER: "Only user with role 'MANAGER' is acceptable",
		BOTH_PASSWORDS_REQUIRED: "Both current and new passwords are required",
		INVALID_PASSWORD:
			"contain at least one digit and one non-digit character, and be at least 8 characters long",
		UPDATE_FIELDS: "At least one field must be provided for the update",
		UNKNOWN_USER: "No matching user found",
		ASSIGN_USERS_TO_PROJECT:
			"Only associated manager can assign users to project",
		ASSIGN_TASK_TO_PROJECT:
			"Only associated manager can assign task to project",
		UNASSIGN_USERS: "Only associated manager can unassign users from project",
		INVALID_PROJECT_STATUS: "Invalid project status",
		INVALID_TASK_STATUS: "Invalid task status",
		TOGGLE_ON_ACTIVE: "Uses can be toggled only on active projects",
		UNACCEPTABLE: "value is unacceptable",
		NO_UPDATE_ON_COMPLETED_PROJECT:
			"You can't update task if associated project is completed",
		ASSOC_MANAGER_UPDATE_TASK:
			"Only associated manager or admin can update task",
		HAS_ACTIVE_TASKS: "Can't finish project that has active tasks"
	},
	SUCCESS: {
		PASSWORD_UPDATED: "Password was successfully updated",
		ROLE_CHANGED: "User's role was successfully changed",
		OP_SUCCESS: "Operation was successful",
		UPDATED_TASK: "Task was successfully updated"
	}
};
