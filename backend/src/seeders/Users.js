const faker = require('faker');
const bcrypt = require('bcrypt');

module.exports = (conn) => {
  const queryInterface = conn.getQueryInterface();
  return {
    up: async () => {
      const [results] = await queryInterface.sequelize.query("SELECT * FROM users;");
      if (!results.length) {
        const users = [...Array(32)].map(() => {
          return {
            name: faker.name.firstName(),
            surname: faker.name.lastName(),
            email: faker.internet.email().toLowerCase(),
            avatar: null,
            role: "USER",
            password: bcrypt.hashSync('password123', 10),
          }
        });
        console.log("Successfully run users seeder");
        return queryInterface.bulkInsert('users', users, {});
      }
      return;
    },
    down: () => {
      return queryInterface.bulkDelete('users', null, {});
    },
  }
};