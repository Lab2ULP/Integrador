const { DataTypes } = require('sequelize');
const db = require('../config/database');

const Rol = db.define('Rol', {
  ID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombre: {
    type: DataTypes.STRING(15),
    allowNull: false
  }
}, {
  tableName: 'roles',  
  timestamps: false    
});

module.exports = Rol;
