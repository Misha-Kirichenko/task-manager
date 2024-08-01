require("dotenv").config();
const jwt = require("jsonwebtoken");

const generateTokenPairs = (payload) => {
  const {
    ACCESS_TOKEN_KEY,
    REFRESH_TOKEN_KEY,
    ACCESS_TOKEN_EXPIRE,
    REFRESH_TOKEN_EXPIRE
  } = process.env;

  const accessToken = jwt.sign(payload, ACCESS_TOKEN_KEY, {
    expiresIn: ACCESS_TOKEN_EXPIRE,
  });

  const refreshToken = jwt.sign(payload, REFRESH_TOKEN_KEY, {
    expiresIn: REFRESH_TOKEN_EXPIRE,
  });

  return { accessToken, refreshToken };
};

module.exports = generateTokenPairs;