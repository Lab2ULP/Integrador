const Profesional = require('./profesional');
const Especialidad = require('./especialidad');
const Persona = require('./persona')
const Sucursal = require('./sucursal'); 
const Agenda = require('./agenda'); 
const ProfesionalEspecialidad = require('./profesionalEspecialidad');
const Dia = require('./dia');
const AgendaDia = require('./agendaDia'); 
const Clasificacion = require('./clasificacion'); 
const AgendaClasificacion = require('./agendaClasificacion'); 
const ProfesionalDiasNoLaborables = require('./profesionalDiasNoLaborables')
const DiasNoLaborables = require('./diasNoLaborables');
const Turno = require('./turno');
const Paciente = require('./paciente');
const Usuario = require ('./usuario');

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

Usuario.belongsTo(Persona, { foreignKey: 'personaID' });

Turno.belongsTo(Paciente, { foreignKey: 'pacienteID' });

Turno.belongsTo(Agenda, { foreignKey: 'agendaID'});

Profesional.belongsTo(Persona, { foreignKey: 'personaID' });
Persona.hasOne(Profesional, { foreignKey: 'personaID' });

ProfesionalEspecialidad.belongsTo(Especialidad,{foreignKey:'especialidadID'})
ProfesionalEspecialidad.belongsTo(Profesional,{foreignKey:'profesionalID'})

// Definir la relación entre Agenda y ProfesionalEspecialidad
Agenda.belongsTo(ProfesionalEspecialidad, { foreignKey: 'prof_especialidadID' });

// Definir la relación entre Agenda y Sucursal
Agenda.belongsTo(Sucursal, { foreignKey: 'sucursalID' });

Profesional.belongsTo(Persona, { foreignKey: 'personaID' }); 
ProfesionalDiasNoLaborables.belongsTo(Profesional, { foreignKey: 'profesionalID'});
ProfesionalDiasNoLaborables.belongsTo(DiasNoLaborables, { foreignKey: 'dia_no_laborablesID'});

// Definir las relaciones muchos a muchos

Agenda.hasMany(Turno, {
    foreignKey: 'agendaID',
    timestamps: false
});

Paciente.hasMany(Turno, {
    foreignKey: 'pacienteID',
    timestamps: false
});

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
    DiasNoLaborables,
    Turno,
    Paciente,
    Usuario
};