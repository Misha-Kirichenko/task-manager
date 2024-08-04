const { Router } = require('express');
const router = Router();
const { statusCodeMessage, generateTokenPairs } = require('@utils');
const { verifyTokenMiddleware } = require('@middlewares/auth');


router.get('/refresh', verifyTokenMiddleware("refresh"), (req, res) => {
  try {
    const { id, email, role } = req.user;
    const tokenPairs = generateTokenPairs({ id, email, ...(role && { role }) });
    return res.send(tokenPairs);
  } catch (error) {
    const { status, message } = statusCodeMessage(error);
    return res.status(status).send({ message });
  }
});

module.exports = router;