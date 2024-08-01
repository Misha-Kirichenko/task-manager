require("dotenv").config();

const { Sequelize } = require("sequelize")

const settings = require('./settings');


const conn = new Sequelize(
  process.env.DB, 
  process.env.USER, 
  process.env.PASSWORD,
  settings
);

module.exports = conn;