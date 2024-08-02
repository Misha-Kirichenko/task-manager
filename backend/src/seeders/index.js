require("dotenv").config();
require("module-alias/register");

const conn = require("@config/conn");
const connectDB = require("@config/connectDB");

connectDB(conn);

const usersSeeder = require("./Users")(conn);
const adminsSeeder = require("./Admins")(conn);

(async () => {
  try {
    const seeders = [
      usersSeeder.up(100),
      adminsSeeder.up()
    ];
    await Promise.all(seeders)
  } catch (error) {
    console.error("seeding error:", error);
  }
})();