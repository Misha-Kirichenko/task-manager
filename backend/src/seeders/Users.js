const faker = require('faker');
const bcrypt = require('bcrypt');

module.exports = (conn) => {
  const queryInterface = conn.getQueryInterface();
  return {
    up: async (amount) => {
      const [results] = await queryInterface.sequelize.query("SELECT * FROM users;");
      if (results.length < amount) {
        const usersToSeed = Math.abs(amount - results.length);
        const users = [...Array(usersToSeed)].map((_, index) => {
          const name = faker.name.firstName();
          const surname = faker.name.lastName();
          const role = index <= 10 ? 'MANAGER' : 'USER'; 

          return {
            name,
            surname,
            role,
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