const settings = {
  dialect: "postgres",
  host: 'database',
  port: 5432,
  password: process.env.PASSWORD,
  pool: {
    max: 5,
    min: 0,
    acquire: 3000,
    idle: 10000,
  },
};

module.exports = settings;