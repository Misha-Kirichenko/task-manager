const { Router } = require('express');
const router = Router();
const getValidErrorData = require('@utils/statusCodeMessages');
const generateTokenPairs = require('@utils/securityUtils');
const verifyToken = require('@middlewares/verifyToken');


router.get('/refresh', verifyToken("refresh"), (req, res) => {
  try {
    const { id, email, role } = req.user;
    const tokenPairs = generateTokenPairs({ id, email, ...(role && { role }) });
    return res.send(tokenPairs);
  } catch (error) {
    const { status, message } = getValidErrorData(error);
    return res.status(status).send({ message });
  }
});

module.exports = router;