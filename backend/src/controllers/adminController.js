const { Router } = require('express');
const router = Router();
const createAbstractUserController = require('@controllers/abstract/abstractUserController');
const conn = require('@config/conn');
const Admin = require('@models/Admin')(conn);
const User = require('@models/User')(conn);
const { ADMIN_ROLES } = require("@constants/roles");
const { verifyTokenMiddleware, checkRolesMiddleware } = require('@middlewares/auth')
const { abstractUpdateMiddleware, changeUserRoleMiddleware, abstractCreateMiddleware } = require('@middlewares/validation');
const { abstractUpdateValidateSchema, abstractCreateValidateSchema } = require("@middlewares/validation/schemas");
const { statusCodeMessage } = require("@utils");
const adminService = require('@services/adminService');

const abstractUserController = createAbstractUserController(Admin);

router.use('/', abstractUserController);

router.patch('/change-user-role/:id',
  [
    verifyTokenMiddleware("access"),
    checkRolesMiddleware(ADMIN_ROLES),
    changeUserRoleMiddleware
  ], async (req, res) => {
    try {
      const answer = await adminService.changeUserRole(req.params.id, req.body.role);
      return res.send(answer);
    } catch (error) {
      const { status, message } = statusCodeMessage(error);
      return res.status(status).send({ message });
    }
  });

router.patch('/user/:id',
  [
    verifyTokenMiddleware("access"),
    checkRolesMiddleware([ADMIN_ROLES[0]]),
    abstractUpdateValidateSchema(User),
    abstractUpdateMiddleware
  ], async (req, res) => {
    try {
      const answer = await adminService.updateUser(req.params.id, req.body);
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

router.post('/user',
  [
    verifyTokenMiddleware("access"),
    checkRolesMiddleware(ADMIN_ROLES[0]),
    abstractCreateValidateSchema(User),
    abstractCreateMiddleware
  ], async (req, res) => {
    try {
      const answer = await adminService.createUser(req.body);
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
