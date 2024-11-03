const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Profesional = require('./profesional'); // Importamos el modelo Profesional
const Especialidad = require('./especialidad'); // Importamos el modelo Especialidad

const EspecialidadesProfesionales = sequelize.define('EspecialidadesProfesionales', {
    ID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    especialidadID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Especialidad,
            key: 'ID'
        }
    },
    profesionalID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Profesional,
            key: 'ID'
        }
    },
    matricula: {
        type: DataTypes.STRING(10),
        allowNull: false
    }
}, {
    tableName: 'especialidades_profesionales',
    timestamps: false
});

module.exports = EspecialidadesProfesionales;