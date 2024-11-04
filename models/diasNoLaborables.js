const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Profesional = require('./profesional')

const DiasNoLaborables = sequelize.define('DiasNoLaborables', {
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

module.exports = DiasNoLaborables;
