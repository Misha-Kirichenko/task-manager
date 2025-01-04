const convertToTimestamp = (result, key) => {
	if (result[key]) {
		result[key] = Date.parse(result[key]);
	}
};

module.exports = convertToTimestamp;
