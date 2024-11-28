
// /models/usuario.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Persona = sequelize.define('Persona',{

  ID: {
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
  }
},{
    modelName: 'Persona',
    timestamps:false,
    tableName:'personas'
})


module.exports = Persona;
