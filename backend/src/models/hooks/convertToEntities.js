const he = require("he");

const convertToEntities = (project) => {
	if (project.projectDescription) {
		project.projectDescription = he.encode(project.projectDescription);
	}
};

module.exports = convertToEntities;
