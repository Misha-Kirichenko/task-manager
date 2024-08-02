const { Router } = require('express');
const router = Router();
const userService = require('@services/userService');
const getValidErrorData = require('@utils/statusCodeMessages');
const verifyToken = require('@middlewares/verifyToken');

router.get('/profile', verifyToken("access"), async (req, res) => {
  try {
    const profile = await userService.getProfile(req.user.id);
    return res.send(profile);
  } catch (error) {
    const { status, message } = getValidErrorData(error);
    return res.status(status).send({ message });
  }
});

module.exports = router;
