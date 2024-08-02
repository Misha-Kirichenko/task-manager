require("dotenv").config();
require("module-alias/register");

const conn = require("@config/conn");
const connectDB = require("@config/connectDB");

connectDB(conn);


const usersMigration = require("./Users")(conn);
const adminsMigration = require("./Admins")(conn);

(async () => {
  try {
    const migrations = [
      usersMigration.up(),
      adminsMigration.up()
    ]
    await Promise.all(migrations);
  } catch (error) {
    console.error("migrations error:", error);
  }
})();