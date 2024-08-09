module.exports = {
  PASSWORD: /^(?=.*\d)(?=.*[^0-9]).{8,}$/,
  EMAIL: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  NAME: /^[a-zA-Z]{2,50}$/,
  SURNAME: /^[a-zA-Z][a-zA-Z'-]{1,49}$/,
  UUID: /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/
};