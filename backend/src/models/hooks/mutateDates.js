const mutateDates = (result) => {
	if (Array.isArray(result) && result.length) {
		result.forEach(mutate);
	} else if (result) {
		mutate(result);
	}
	function mutate(project) {
		function getSeparateDateKeys(timestamp) {
			const dateObj = new Date(timestamp);
			const date = dateObj.getDate().toString().padStart(2, "0");
			const month = (dateObj.getMonth() + 1).toString().padStart(2, "0");
			const year = dateObj.getFullYear();
			const hours = dateObj.getHours().toString().padStart(2, "0");
			const minutes = dateObj.getMinutes().toString().padStart(2, "0");
			const dateString = `${date}/${month}/${year}`;
			const timeString = `${hours}:${minutes}`;
			return { date: dateString, time: timeString };
		}
		const startDate = Number(project.startDate);
		const endDate = Number(project.endDate);

		project.startDate = startDate ? getSeparateDateKeys(startDate) : 0;
		project.endDate = endDate ? getSeparateDateKeys(endDate) : 0;
	}
};

module.exports = mutateDates;
