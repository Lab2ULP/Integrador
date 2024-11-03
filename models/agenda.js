const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const ProfesionalEspecialidad = require('./profesionalEspecialidad')
const Sucursal = require('./sucursal')

const Agenda = sequelize.define('Agenda', {
    ID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    sobre_turnos_limites: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    prof_especialidadID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: ProfesionalEspecialidad, // Nombre de la tabla en la base de datos
            key: 'ID'
        }
    },
    sucursalID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Sucursal, // Nombre de la tabla en la base de datos
            key: 'ID'
        }
    },
    duracion_turnos: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    fecha_desde: {
        type: DataTypes.DATE,
        allowNull: false
    },
    fecha_hasta: {
        type: DataTypes.DATE,
        allowNull: false
    }
}, {
    tableName: 'agendas',
    timestamps: false
});

module.exports = Agenda;
