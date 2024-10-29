const { DataTypes } = require('sequelize');
const db = require('../config/database');

const Persona = db.define('Persona',{
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
    timestamps:false
})


module.exports = Persona;
