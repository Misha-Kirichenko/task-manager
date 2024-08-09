module.exports = {
  SELECT_TABLE: (table) => `SELECT * FROM information_schema.tables WHERE table_name = '${table}'`
};