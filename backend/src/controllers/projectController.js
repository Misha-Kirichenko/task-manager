const { Router } = require('express');
const router = Router();
const conn = require('@config/conn');
const { ADMIN_ROLES } = require("@constants/roles");
const { Project } = require('@models')(conn);
const { verifyTokenMiddleware, checkRolesMiddleware } = require('@middlewares/auth')
const { abstractCreateMiddleware } = require('@middlewares/validation');
const { abstractCreateValidateSchema } = require("@middlewares/validation/schemas");
const projectService = require('@services/projectService');
const { statusCodeMessage } = require("@utils");

router.post('/',
  [
    verifyTokenMiddleware("access"),
    checkRolesMiddleware(ADMIN_ROLES),
    abstractCreateValidateSchema(Project),
    abstractCreateMiddleware
  ], async (req, res) => {
    try {
      const answer = await projectService.createProject(req.body);
      return res.send(answer);
    } catch (error) {
      const [errorType, errorDetails] = Object.values(error);
      if (errorType === "SequelizeUniqueConstraintError") {
        const { message } = errorDetails[0];
        return res.status(400).send({ message });
      }
      const { status, message } = statusCodeMessage(error);
      return res.status(status).send({ message });
    }
  });


module.exports = router;
