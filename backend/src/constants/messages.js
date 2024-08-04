module.exports = {
  ERRORS: {
    INVALID_NAME: "contain only Latin letters and be between 2 and 50 characters long",
    INVALID_SURNAME: "start with a Latin letter, can contain only Latin letters, hyphens, apostrophes, and be between 2 and 50 characters long",
    INVALID_EMAIL: 'be a valid email address (e.g., user@example.com)',
    ALL_FIELDS_REQUIRED: "All fields are required",
    INTERNAL_SERVER_ERROR: 'Internal Server Error',
    BAD_REQUEST: 'Ooops...Something went wrong!',
    UNAUTHORIZED: 'Invalid credentials',
    FORBIDDEN: 'You have no access rights',
    INVALID_ROLE: 'You passed invalid role',
    NO_ROLE: 'No role was passed',
    INCORRECT_PASSWORD: "Current password is incorrect",
    BOTH_PASSWORDS_REQUIRED: "Both current and new passwords are required",
    INVALID_PASSWORD: 'contain at least one digit and one non-digit character, and be at least 8 characters long',
    UPDATE_FIELDS: "At least one field must be provided for the update"
  },
  SUCCESS: {
    PASSWORD_UPDATED: "Password was successfully updated",
    ROLE_CHANGED: "User's role was successfully changed"
  }
};