const convertToTimestamp = (result, ...keys) => {
	for (const key of keys) {
		if (result[key]) {
			if (typeof result[key] !== "object") {
				const parsedData = Date.parse(result[key]);
				if (!isNaN(parsedData)) {
					result[key] = parsedData;
				}
			} else {
				let date = Date.parse(
					`${result[key].date.split("/").reverse().join("-")}T${
						result[key].time
					}`
				);

				result[key] = date;
			}
		}
	}
};

module.exports = convertToTimestamp;
