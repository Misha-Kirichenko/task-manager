const { getSeparateDateKeys } = require("@utils");

const mutateDates = (result, ...keys) => {
	if (Array.isArray(result) && result.length) {
		result.forEach((obj) => mutate(obj, keys));
	} else if (result) {
		mutate(result, keys);
	}

	function mutate(result, keys) {
		for (const key of keys) {
			const keyVal = Number(result[key]);
			result[key] = keyVal ? getSeparateDateKeys(keyVal) : keyVal;
		}
	}
};

module.exports = mutateDates;
