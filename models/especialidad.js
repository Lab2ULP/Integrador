const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Profesional = require('./profesional');

const Especialidad = sequelize.define('Especialidad', {
    ID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre: {
        type: DataTypes.STRING(20),
        allowNull: false,
        unique: true
    }
}, {
    tableName: 'especialidades',
    timestamps: false
});

module.exports = Especialidad;