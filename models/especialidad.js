const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Profesional = require('./profesional');
const ProfesionalEspecialidad = require('./profesionalEspecialidad');

const Especialidad = sequelize.define('Especialidad', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombre: {
    type: DataTypes.STRING(30),
    allowNull: false
  }
}, {
  tableName: 'especialidades',
  timestamps: false
});

module.exports = Especialidad;

Especialidad.belongsToMany(Profesional, { through: ProfesionalEspecialidad, foreignKey: 'especialidadID' });