const { Router } = require('express');
const router = Router();
const createAbstractUserController = require('@controllers/abstract/abstractUserController');
const conn = require('@config/conn');
const Admin = require('@models/Admin')(conn);

const abstractUserController = createAbstractUserController(Admin);

router.use('/', abstractUserController);

router.get('/ok', (req, res) => res.send({ msg: "admin" }));

module.exports = router;
