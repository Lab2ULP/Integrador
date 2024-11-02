const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Profesional = require('./profesional');
const DiasNoLaborables = require('./diasNoLaborables');

// Definición del modelo ProfesionalDiasNoLaborables
const ProfesionalDiasNoLaborables = sequelize.define('ProfesionalDiasNoLaborables', {
  ID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombre: {
    type: DataTypes.STRING(20),
  },
  profesionalID: {
    type: DataTypes.INTEGER,
    references: {
      model: Profesional,
      key: 'ID'
    }
  },
  dia_no_laborablesID: {
    type: DataTypes.INTEGER,
    references: {
      model: DiasNoLaborables,
      key: 'ID'
    }
  },
  fecha: {
    type: DataTypes.DATE,
    allowNull: false
  },
}, {
  tableName: 'profesional_dias_no_laborables',
  timestamps: false
});


module.exports = ProfesionalDiasNoLaborables;
