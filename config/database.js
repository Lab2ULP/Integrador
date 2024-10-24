const { Sequelize } = require('sequelize');

// Configuración de Sequelize
const sequelize = new Sequelize('agenda_consultorio', 'root', '', {
  host: 'localhost',
  dialect: 'mysql',
});

module.exports = sequelize;

// mi ramita