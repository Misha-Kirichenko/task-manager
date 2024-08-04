module.exports = {
  PASSWORD: /^(?=.*\d)(?=.*[^0-9]).{8,}$/,
  EMAIL: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  NAME: /^[a-zA-Z]{2,50}$/,
  SURNAME: /^[a-zA-Z][a-zA-Z'-]{1,49}$/
};