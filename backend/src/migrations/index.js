require("dotenv").config();
require("module-alias/register");

const conn = require("@config/conn");
const connectDB = require("@config/connectDB");

connectDB(conn);


const usersMigration = require("./Users")(conn);
const adminsMigration = require("./Admins")(conn);
const projectsMigration = require("./Projects")(conn);

(async () => {
  try {
    await usersMigration.up();
    await adminsMigration.up();
    await projectsMigration.up();

  } catch (error) {
    console.error("migrations error:", error);
  }
})();