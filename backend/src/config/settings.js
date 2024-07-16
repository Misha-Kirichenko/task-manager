const settings = {
  dialect: "postgres",
  host: 'task_manager_db',
  port: 5432,
  pool: {
    max: 5,
    min: 0,
    acquire: 3000,
    idle: 10000,
  },
};

module.exports = settings;