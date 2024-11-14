const Sequelize = require('sequelize');

const sequelize = new Sequelize(
  process.env.MYSQL_ADDON_DB,      // Nombre de la base de datos
  process.env.MYSQL_ADDON_USER,    // Usuario
  process.env.MYSQL_ADDON_PASSWORD, // Contraseña
  {
    host: process.env.MYSQL_ADDON_HOST,
    port: process.env.MYSQL_ADDON_PORT,
    dialect: 'mysql',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    }
  }
);

module.exports = sequelize;

