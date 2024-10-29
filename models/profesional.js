// models/profesional.js
const { DataTypes } = require('sequelize');
const db = require('../config/database');
const Persona = require('./persona');
const DiasNoLaborables = require('./diasNoLaborables');
const ProfesionalDiasNoLaborables = require('./profesionalDiasNoLaborables'); // tabla intermedia



const Profesional = db.define('profesional', {
    ID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    personaID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Persona,
            key: 'ID'
        }
    }
}, {
    tableName: 'profesionales',
    timestamps: false
});

// Relación con Persona
Profesional.belongsTo(Persona, { foreignKey: 'personaID', as: 'persona' });

// Relación muchos a muchos con DiasNoLaborables
Profesional.belongsToMany(DiasNoLaborables, {
    through: ProfesionalDiasNoLaborables,
    foreignKey: 'profesionalID',  // llave foránea de Profesional
    otherKey: 'dia_no_laborablesID', // llave foránea de DiasNoLaborables
    as: 'diasNoLaborables'
});

 module.exports = Profesional;
