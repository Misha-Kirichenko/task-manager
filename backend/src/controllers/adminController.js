const { Router } = require('express');
const router = Router();
const conn = require("@config/conn");
const Admin = require("@models/Admin")(conn);
const authService = require('@services/authService')(Admin);
const profileService = require("@services/profileService")(Admin);
const passwordService = require('@services/passwordService')(Admin);
const getValidErrorData = require('@utils/statusCodeMessages');
const verifyToken = require('@middlewares/verifyToken');
const validatePassword = require('@middlewares/validatePassword');


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


router.get('/profile', verifyToken("access"), async (req, res) => {
  try {
    const profile = await profileService.getProfile(req.user.id);
    return res.send(profile);
  } catch (error) {
    const { status, message } = getValidErrorData(error);
    return res.status(status).send({ message });
  }
});

router.patch('/password', [verifyToken("access"), validatePassword], async (req, res) => {
  try {
    const answer = await passwordService.updatePassword(req.user.id, req.body);
    return res.send(answer);
  } catch (error) {
    const { status, message } = getValidErrorData(error);
    return res.status(status).send({ message });
  }
});

module.exports = router;
