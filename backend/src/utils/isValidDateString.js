// const isValidDateString = (dateString) =>
// 	typeof dateString === "string"
// 		? !isNaN(Date.parse(dateString)) &&
// 		  dateString === new Date(dateString).toISOString().slice(0, 10)
// 		: false;

// module.exports = isValidDateString;

const isValidDateString = (dateString) =>
	typeof dateString === "string"
		? !isNaN(Date.parse(dateString)) &&
		  dateString.length >= 10 &&
		  new Date(dateString).toISOString().includes(dateString)
		: false;

module.exports = isValidDateString;
