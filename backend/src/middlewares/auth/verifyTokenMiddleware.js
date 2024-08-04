const jwt = require("jsonwebtoken");

const verifyTokenMiddleware = (tokenType) => (req, res, next) => {
  const { headers } = req;

  if (!headers.authorization) {
    return res.status(400).send({ message: "No Authorization header passed" });
  }

  const [type, token] = headers.authorization.split(" ");

  if (type !== "Bearer" || !token) {
    return res.status(401).send({ message: "Incorrect token or no token passed" });
  }
  try {
    const decoded = jwt.verify(token, process.env[`${(tokenType.toUpperCase())}_TOKEN_KEY`]);
    req.user = decoded;
  } catch (err) {
    return res.status(401).send({ message: "Invalid authorization info" });
  }
  return next();
};

module.exports = verifyTokenMiddleware;