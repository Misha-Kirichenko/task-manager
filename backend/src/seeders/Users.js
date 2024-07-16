const faker = require('faker');
const bcrypt = require('bcrypt');

module.exports = (conn) => {
  const queryInterface = conn.getQueryInterface();
  return {
    up: async () => {
      const [results] = await queryInterface.sequelize.query("SELECT * FROM users;");
      if (!results.length) {
        const users = [...Array(64)].map(() => {
          const name = faker.name.firstName();
          const surname = faker.name.lastName();
          return {
            name,
            surname,
            email: faker.internet.email(name, surname).toLowerCase(),
            avatar: null,
            role: "USER",
            password: bcrypt.hashSync('password123', 10),
          }
        });
        console.log("Successfully executed users seeder");
        return queryInterface.bulkInsert('users', users, {});
      }
      return;
    },
    down: () => {
      return queryInterface.bulkDelete('users', null, {});
    },
  }
};