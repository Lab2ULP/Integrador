const { Sequelize } = require('sequelize');


const sequelize = new Sequelize({
  host: process.env.DB_HOST,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  dialect: 'mysql',
});

/*
const sequelize = new Sequelize('agenda_consultorio', 'root', '', {
  host: 'localhost',
  dialect: 'mysql',
});
*/

module.exports = sequelize;
