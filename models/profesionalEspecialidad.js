const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Profesional = require('./profesional');
const Especialidad = require('./especialidad');

const ProfesionalEspecialidad = sequelize.define('ProfesionalEspecialidad', {
  ID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
},
especialidadID: {
  type: DataTypes.INTEGER,
  references: {
    model: Especialidad,
    key: 'id'
  }
},
profesionalID: {
  type: DataTypes.INTEGER,
  references: {
    model: Profesional,
    key: 'id'
  }
},
  matricula: {
    type: DataTypes.STRING(30),
    allowNull: false
}
}, {
  tableName: 'especialidades_profesionales',
  timestamps: false
});

module.exports = ProfesionalEspecialidad;
