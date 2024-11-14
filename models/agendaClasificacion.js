const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Agenda = require('./agenda'); 
const Clasificacion = require('./clasificacion'); 

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
    tableName: 'agendas_clasificaciones', 
    timestamps: false
});

module.exports = AgendaClasificacion;
