const connectDB = async (conn) => {
  try {
    await conn.authenticate();
    console.log("Successfully connected to database")
  } catch (error) {
    console.error("database connection error:", error);
  }
};

module.exports = connectDB;