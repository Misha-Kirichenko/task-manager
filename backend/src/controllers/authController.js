const { Router } = require('express');
const router = Router();
const authService = require('@services/authService');
const getValidErrorData = require('@utils/statusCodeMessages');
const generateTokenPairs = require('@utils/securityUtils');
const verifyToken = require('@middlewares/verifyToken');

router.post('/login', async (req, res) => {
  try {
    const { login, password } = req.body;
    const answer = await authService.login(login, password);
    return res.send(answer);
  } catch (error) {
    const { status, message } = getValidErrorData(error);
    return res.status(status).send({ message });
  }
});

router.get('/refresh', verifyToken("refresh"), (req, res) => {
  try {
    const { id, login, role } = req.user;
    const tokenPairs = generateTokenPairs({ id, login, role });
    return res.send(tokenPairs);
  } catch (error) {
    const { status, message } = getValidErrorData(error);
    return res.status(status).send({ message });
  }
});

module.exports = router;