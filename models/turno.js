const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Agenda = require('./agenda');
const Paciente = require('./paciente');

const Turno = sequelize.define('Turno', {
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
    fecha: {
        type: DataTypes.DATE,
        allowNull: false
    },
    hora_inicio: {
        type: DataTypes.TIME,
        allowNull: false
    },
    hora_final: {
        type: DataTypes.DATE,
        allowNull: false
    },
    motivo: {
        type: DataTypes.STRING(30),
        allowNull: false
    },
    pacienteID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Paciente,
            key: 'ID'
        }
    },
    estado_turno: {
        type: DataTypes.ENUM('No disponible','Libre','Reservado','Confirmado','Cancelado','Ausente','Presente','En consulta','Atendido','Sobreturno'),
        allowNull: false,
        defaultValue: 'pendiente'
    }
}, {
    tableName:'turnos',
    timestamps:false
})

module.exports = Turno;