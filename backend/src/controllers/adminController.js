const { Router } = require('express');
const router = Router();
const createAbstractUserController = require('@controllers/abstract/abstractUserController');
const conn = require('@config/conn');
const Admin = require('@models/Admin')(conn);
const { ADMIN_ROLES } = require("@constants/roles");
const { verifyTokenMiddleware, checkRolesMiddleware } = require('@middlewares/auth')
const { updateUserMiddleware, changeUserRoleMiddleware } = require('@middlewares/validation');
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
    checkRolesMiddleware(ADMIN_ROLES),
    updateUserMiddleware
  ], async (req, res) => {
    try {
      const answer = await adminService.updateUser(req.params.id, req.body);
      return res.send(answer);
    } catch (error) {
      const { status, message } = statusCodeMessage(error);
      return res.status(status).send({ message });
    }
  });

module.exports = router;
