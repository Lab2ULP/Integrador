const Persona = require('./persona');
const ProfesionalDiasNoLaborables = require('./profesionalDiasNoLaborables'); // tabla intermedia
const Profesional = require('./profesional');
const DiasNoLaborables = require('./diasNoLaborables');

// Relación con Persona
Profesional.belongsTo(Persona, { foreignKey: 'personaID', as: 'persona' });

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

module.exports = {
  Profesional,
  DiasNoLaborables,
  ProfesionalDiasNoLaborables,
  Persona
};


