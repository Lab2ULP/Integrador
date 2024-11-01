const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Agenda = require('./agenda'); // Importar el modelo Agenda
const Clasificacion = require('./clasificacion'); // Importar el modelo Clasificacion

const AgendaClasificacion = sequelize.define('AgendaClasificacion', {
    ID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    agendaID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Agenda,
            key: 'ID'
        }
    },
    clasificacionID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Clasificacion,
            key: 'ID'
        }
    }
}, {
    tableName: 'agendas_clasificaciones', // Cambia este nombre si es diferente en tu base de datos
    timestamps: false
});

module.exports = AgendaClasificacion;
