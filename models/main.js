const Profesional = require('./profesional');
const Especialidad = require('./especialidad');
const Persona = require('./persona')

// Definir las relaciones muchos a muchos en un lugar central
Profesional.belongsToMany(Especialidad, {
    through: 'especialidades_profesionales',
    foreignKey: 'profesionalID',
    otherKey: 'especialidadID'
});

Especialidad.belongsToMany(Profesional, {
    through: 'especialidades_profesionales',
    foreignKey: 'especialidadID',
    otherKey: 'profesionalID'
});

Profesional.belongsTo(Persona, { foreignKey: 'personaID' }); // Asume que la columna en Profesional es personaID

module.exports = {
    Profesional,
    Especialidad,
    Persona
};

