const { Router } = require('express');
const router = Router();
const createAbstractUserController = require('@controllers/abstract/abstractUserController');
const conn = require('@config/conn');
const { User } = require('@models')(conn);

const abstractUserController = createAbstractUserController(User);

router.use('/', abstractUserController);

module.exports = router;