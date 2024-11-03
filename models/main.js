const Profesional = require('./profesional');
const Especialidad = require('./especialidad');
const Persona = require('./persona')
const Sucursal = require('./sucursal'); // Importar el modelo Sucursal
const Agenda = require('./agenda'); // Importar el modelo Agenda
const ProfesionalEspecialidad = require('./profesionalEspecialidad'); // Importar el modelo ProfesionalEspecialidad
const Dia = require('./dia');
const AgendaDia = require('./agendaDia'); // Importar el nuevo modelo
const Clasificacion = require('./clasificacion'); // Importar el modelo Clasificacion
const AgendaClasificacion = require('./agendaClasificacion'); // Importar el nuevo modelo
const ProfesionalDiasNoLaborables = require('./profesionalDiasNoLaborables')
const DiasNoLaborables = require('./diasNoLaborables');

// Definir las relaciones muchos a muchos en un lugar central
Profesional.belongsToMany(Especialidad, {
    through: 'especialidades_profesionales',
    foreignKey: 'profesionalID',
    otherKey: 'especialidadID',
    timestamps:false
});

Especialidad.belongsToMany(Profesional, {
    through: 'especialidades_profesionales',
    foreignKey: 'especialidadID',
    otherKey: 'profesionalID',
    timestamps:false
});

// Definir la relación entre Agenda y ProfesionalEspecialidad
Agenda.belongsTo(ProfesionalEspecialidad, { foreignKey: 'prof_especialidadID' });

// Definir la relación entre Agenda y Sucursal
Agenda.belongsTo(Sucursal, { foreignKey: 'sucursalID' });

Profesional.belongsTo(Persona, { foreignKey: 'personaID' }); // Asume que la columna en Profesional es personaID
ProfesionalDiasNoLaborables.belongsTo(Profesional, { foreignKey: 'profesionalID'});
ProfesionalDiasNoLaborables.belongsTo(DiasNoLaborables, { foreignKey: 'dia_no_laborablesID'});

// Definir las relaciones muchos a muchos
Agenda.belongsToMany(Dia, {
    through: AgendaDia,
    foreignKey: 'agendaID',
    otherKey: 'diaID',
    timestamps: false
});

Dia.belongsToMany(Agenda, {
    through: AgendaDia,
    foreignKey: 'diaID',
    otherKey: 'agendaID',
    timestamps: false
});

Agenda.belongsToMany(Clasificacion, {
    through: AgendaClasificacion,
    foreignKey: 'agendaID',
    otherKey: 'clasificacionID',
    timestamps: false
});

Clasificacion.belongsToMany(Agenda, {
    through: AgendaClasificacion,
    foreignKey: 'clasificacionID',
    otherKey: 'agendaID',
    timestamps: false
});

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

module.exports = {
    Profesional,
    Especialidad,
    Persona,
    Sucursal,
    Agenda,
    ProfesionalEspecialidad,
    Dia,
    AgendaDia,
    Clasificacion,
    AgendaClasificacion,
    ProfesionalDiasNoLaborables,
    DiasNoLaborables
};

