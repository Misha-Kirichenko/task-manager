const isValidDateString = (dateString) =>
	typeof dateString === "string"
		? !isNaN(Date.parse(dateString)) &&
		  dateString === new Date(dateString).toISOString().slice(0, 10)
		: false;

module.exports = isValidDateString;
