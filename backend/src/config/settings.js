require("dotenv").config();

const settings = {
  dialect: "postgres",
  host: process.env.POSTGRES_HOST,
  port: process.env.POSTGRES_PORT,
  pool: {
    max: 5,
    min: 0,
    acquire: 3000,
    idle: 10000,
  },
};

module.exports = settings;