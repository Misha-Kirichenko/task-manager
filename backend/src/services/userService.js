const conn = require("@config/conn");
const User = require("@models/User")(conn);
const createHttpException = require("@utils/createHttpException");


exports.login = (login, password) => {
  if (!login || !password) {
    const httpException = createHttpException(401, 'All fields are required')
    throw httpException;
  }
  return { message: "success" };
}