const { DataTypes } = require('sequelize');
const db = require('../config/database');
const Profesional = require('./profesional'); // Asegúrate de que el nombre del modelo coincida
const ProfesionalDiasNoLaborables = require('./profesionalDiasNoLaborables'); // modelo intermedio

const DiasNoLaborables = db.define('dias_no_laborables', {
    ID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre: {
        type: DataTypes.STRING(10),
        allowNull: false
    }
}, {
    tableName: 'dias_no_laborables',
    timestamps: false
});

// Relación muchos a muchos con Profesional
DiasNoLaborables.belongsToMany(Profesional, {
    through: ProfesionalDiasNoLaborables,
    foreignKey: 'dia_no_laborablesID',  // Llave foránea en la tabla intermedia
    otherKey: 'profesionalID',       // Llave foránea de Profesional en la tabla intermedia
    as: 'profesionales'
});

module.exports = DiasNoLaborables;
