const { createHttpException, MESSAGE_UTIL } = require("@utils");
const { Op } = require("sequelize");

module.exports = (Model) => ({
	async delete(id) {
		const deletedRows = await Model.destroy({ where: { id } });
		if (!deletedRows) {
			const notFoundException = createHttpException(
				404,
				MESSAGE_UTIL.ERRORS.NOT_FOUND(Model.name)
			);
			throw notFoundException;
		}
		return { message: MESSAGE_UTIL.SUCCESS.DELETED(Model.name) };
	},
	async deleteMany(idArray) {
		const deletedRows = await Model.destroy({
			where: { id: { [Op.in]: idArray } }
		});

		if (deletedRows !== idArray.length) {
			const partialDeleteException = createHttpException(
				207,
				`Partial deletion: only ${deletedRows} out of ${idArray.length} ${Model.name} records were deleted.`
			);
			throw partialDeleteException;
		}

		return { message: `${Model.name} records were sucessfully deleted` };
	}
});
