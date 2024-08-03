const { Router } = require('express');
const router = Router();
const createAbstractUserController = require('@controllers/abstract/abstractUserController');
const conn = require('@config/conn');
const Admin = require('@models/Admin')(conn);
const { ADMIN_ROLES } = require("@constants/roles");
const verifyToken = require('@middlewares/verifyToken');
const checkRoles = require('@middlewares/checkRoles');
const getValidErrorData = require("@utils/statusCodeMessages");
const adminService = require('@services/adminService');

const abstractUserController = createAbstractUserController(Admin);

router.use('/', abstractUserController);

router.patch('/change-user-role/:id', [verifyToken("access"), checkRoles(ADMIN_ROLES)], async (req, res) => {
  try {
    const answer = await adminService.changeUserRole(req.params.id, req.body.role);
    return res.send(answer);
  } catch (error) {
    const { status, message } = getValidErrorData(error);
    return res.status(status).send({ message });
  }
});

module.exports = router;
