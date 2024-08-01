const { Router } = require('express');
const router = Router();
const userService = require('@services/userService');
const getValidErrorData = require('@utils/statusCodeMessages');

router.post('/login', async (req, res) => {
  try {
    const { login, password } = req.body;
    const answer = await userService.login(login, password);
    return res.send(answer);
  } catch (error) {
    const { status, message } = getValidErrorData(error);
    return res.status(status).send({ message });
  }
});

module.exports = router;
