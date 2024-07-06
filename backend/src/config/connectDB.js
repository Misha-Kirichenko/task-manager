const connectDB = async (conn) => {
  try {
    await conn.authenticate();
    await conn.sync();
    console.log("Successfully connected to database")
  } catch (error) {
    console.error(error);
  }
};

module.exports = connectDB;