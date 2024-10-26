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
  tableName: 'roles',  // nombre de la tabla en la BD
  timestamps: false    // Si no usas createdAt y updatedAt
});

module.exports = Rol;
