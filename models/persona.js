// /models/usuario.js
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class Persona extends Model {}

Persona.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nombre: {
    type: DataTypes.STRING(30),
    allowNull: false,
  },
  dni: {
    type: DataTypes.INTEGER,
    unique: true,
    allowNull: false,
  },
  nacimiento: {
    type: DataTypes.DATE,
    allowNull: false,
  },
}, {
  sequelize,
  modelName: 'Persona',
  timestamps:false
});

module.exports = Persona;
