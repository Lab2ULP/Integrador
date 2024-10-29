const { DataTypes } = require('sequelize');
const db = require('../config/database');
const Profesional = require('./profesional');
const DiasNoLaborables = require('./diasNoLaborables');

const ProfesionalDiasNoLaborables = db.define('profesional_dias_no_laborables', {
  ID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
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

// Configuración de las relaciones muchos a muchos
Profesional.belongsToMany(DiasNoLaborables, {
  through: ProfesionalDiasNoLaborables,
  foreignKey: 'profesionalID',
  otherKey: 'dia_no_laborablesID',
  as: 'diasNoLaborables'
}); 


DiasNoLaborables.belongsToMany(Profesional, {
  through: ProfesionalDiasNoLaborables,
  foreignKey: 'dia_no_laborablesID',
  otherKey: 'profesionalID',
  as: 'profesionales'
}); 

module.exports = ProfesionalDiasNoLaborables;
