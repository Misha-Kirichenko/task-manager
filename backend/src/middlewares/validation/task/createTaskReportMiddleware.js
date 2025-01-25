const createTaskReportMiddleware = (req, res, next) => {
	if (Object.keys(req.errors).length) {
		return res.status(400).send({
			message: req.errors
		});
	}
	delete req.errors;
	return next();
};

module.exports = createTaskReportMiddleware;
