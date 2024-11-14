require('dotenv').config(); // Asegúrate de cargar las variables de entorno

const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(process.env.MYSQL_ADDON_DB, process.env.MYSQL_ADDON_USER, process.env.MYSQL_ADDON_PASSWORD, {
  host: process.env.MYSQL_ADDON_HOST,
  dialect: 'mysql',
  port: process.env.MYSQL_ADDON_PORT,
});

module.exports = sequelize;
