const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Agenda = require('./agenda');
const Dia = require('./dia');

const AgendaDia = sequelize.define('AgendaDia', {
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
    diaID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Dia,
            key: 'ID'
        }
    },
    hora_inicio: {
        type: DataTypes.TIME, // Cambiado a tipo TIME
        allowNull: false
    },
    hora_final: {
        type: DataTypes.TIME, // Cambiado a tipo TIME
        allowNull: false
    }
}, {
    tableName: 'dias_agendas',
    timestamps: false
});

module.exports = AgendaDia;
