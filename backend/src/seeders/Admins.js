const bcrypt = require('bcrypt');

module.exports = (conn) => {
  const queryInterface = conn.getQueryInterface();
  const saltRounds = 10;
  return {
    up: async () => {
      const [results] = await queryInterface.sequelize.query("SELECT * FROM admins;");
      if (!results.length) {
        const admins = [
          {
            name: "Admin",
            surname: "User",
            email: "admin_user@example.com",
            password: bcrypt.hashSync('default123', saltRounds),
            root: false
          },
          {
            login: "root",
            password: bcrypt.hashSync('rootPassword123', saltRounds),
            root: true
          }
        ];
        console.log("Successfully executed admins seeder");
        return queryInterface.bulkInsert('admins', admins, {});
      }
      return;
    },
    down: () => {
      return queryInterface.bulkDelete('admins', null, {});
    },
  }
};