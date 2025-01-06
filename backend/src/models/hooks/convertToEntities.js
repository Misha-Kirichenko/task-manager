const he = require("he");

const convertToEntities = (result, key) => {
	if (result.changed(key)) {
		result[key] = he.encode(result[key]);
	}
};

module.exports = convertToEntities;
