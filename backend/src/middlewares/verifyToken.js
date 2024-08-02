const jwt = require("jsonwebtoken");

const verifyToken = (tokenType) => (req, res, next) => {
  const { headers } = req;

  if (!headers.authorization) {
    return res.status(400).send({ msg: "No Authorization header passed" });
  }

  const [type, token] = headers.authorization.split(" ");

  if (type !== "Bearer" || !token) {
    return res.status(401).send({ msg: "Incorrect token or no token passed" });
  }
  try {
    const decoded = jwt.verify(token, process.env[`${(tokenType.toUpperCase())}_TOKEN_KEY`]);
    req.user = decoded;
  } catch (err) {
    return res.status(401).send({ msg: "Invalid authorization info" });
  }
  return next();
};

module.exports = verifyToken;