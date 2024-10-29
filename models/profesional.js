const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Especialidad = require('./especialidad');
const Persona = require('./persona')

const Profesional = sequelize.define('Profesional', {
    ID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    personaID: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    estado: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
}, {
    tableName: 'profesionales',
    timestamps: false,
});

module.exports = Profesional;
