const { Router } = require('express');

const getValidErrorData = require('@utils/statusCodeMessages');
const verifyToken = require('@middlewares/verifyToken');
const validatePassword = require('@middlewares/validatePassword');


module.exports = (Model) => {
  const router = Router();
  const authService = require('@services/authService')(Model);
  const profileService = require("@services/profileService")(Model);

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
      const answer = await profileService.updatePassword(req.user.id, req.body);
      return res.send(answer);
    } catch (error) {
      const { status, message } = getValidErrorData(error);
      return res.status(status).send({ message });
    }
  });

  return router;
}
