const Sequelize = require('sequelize');

const sequelize = new Sequelize(
  'brtwodw9rogowfvwqly4',
  'uvjbdvxadls8jols',
  'ZSou7QsZNZgvu3gO9CPj',
  {
    host: 'brtwodw9rogowfvwqly4-mysql.services.clever-cloud.com',
    port: 3306,
    dialect: 'mysql',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    }
  }
);



// Configuración de Sequelize
/*
const sequelize = new Sequelize(
  'agenda_consultorio', 
  'root', 
  '',
   {
  host: 'localhost',
  dialect: 'mysql',
});
*/
module.exports = sequelize;

// mi ramita

module.exports = sequelize;
