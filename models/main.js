const Profesional = require('./profesional');
const DiasNoLaborables = require('./diasNoLaborables');
const Persona = require('./persona');
const ProfesionalDiasNoLaborables = require('./profesionalDiasNoLaborables')
// Aquí se definen las relaciones


Profesional.belongsToMany(DiasNoLaborables, {
  through: 'profesional_dias_no_laborables',
  foreignKey: 'profesionalID',
  otherKey: 'dia_no_laborablesID',
  timestamps:false
});

DiasNoLaborables.belongsToMany(Profesional, {
  through: 'profesional_dias_no_laborables',
  foreignKey: 'dia_no_laborablesID',
  otherKey: 'profesionalID',
  timestamps:false
});

ProfesionalDiasNoLaborables.belongsTo(Profesional, { foreignKey: 'profesionalID'});
ProfesionalDiasNoLaborables.belongsTo(DiasNoLaborables, { foreignKey: 'dia_no_laborablesID'});
Profesional.belongsTo(Persona, { foreignKey: 'personaID'});
// Exportar todos los modelos
module.exports = {
  Profesional,
  DiasNoLaborables,
  Persona,
  ProfesionalDiasNoLaborables
};
