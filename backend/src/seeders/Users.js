const faker = require('faker');
const bcrypt = require('bcrypt');

module.exports = (conn) => {
  const queryInterface = conn.getQueryInterface();
  const saltRounds = 10;
  return {
    up: async (amount) => {
      const [results] = await queryInterface.sequelize.query("SELECT * FROM users;");
      if (results.length !== amount) {
        const usersToSeed = Math.abs(amount - results);
        const users = [...Array(usersToSeed)].map(() => {
          const name = faker.name.firstName();
          const surname = faker.name.lastName();
          return {
            name,
            surname,
            email: faker.internet.email(name, surname).toLowerCase(),
            password: bcrypt.hashSync('password123', parseInt(process.env.PASSWORD_SALT_ROUNDS)),
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