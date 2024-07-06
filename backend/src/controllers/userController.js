const { Router } = require('express');
const router = Router();
const userService = require('@services/userService');


router.post('/login', (req, res) => {
  try {
    const { login, password } = req.body;
    const answer = userService.login(login, password);
    return res.send(answer);
  } catch (error) {
    const { status, message } = error;
    return res.status(status).send({ message });
  }
});

module.exports = router;
