require("dotenv").config();
require("module-alias/register");

const conn = require("@config/conn");
const connectDB = require("@config/connectDB");

connectDB(conn);


const usersMigration = require("./Users")(conn);

(async () => {
  try {
    const migrations = [
      usersMigration.up()
    ]
    await Promise.all(migrations);
  } catch (error) {
    console.error(error);
  }
})();