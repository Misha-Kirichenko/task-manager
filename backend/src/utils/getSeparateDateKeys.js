const getSeparateDateKeys = (timestamp) => {
	const dateObj = new Date(timestamp);
	const date = dateObj.getDate().toString().padStart(2, "0");
	const month = (dateObj.getMonth() + 1).toString().padStart(2, "0");
	const year = dateObj.getFullYear();
	const hours = dateObj.getHours().toString().padStart(2, "0");
	const minutes = dateObj.getMinutes().toString().padStart(2, "0");
	const dateString = `${date}/${month}/${year}`;
	const timeString = `${hours}:${minutes}`;
	return { date: dateString, time: timeString };
};

module.exports = getSeparateDateKeys;
