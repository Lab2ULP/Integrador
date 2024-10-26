const { DataTypes } = require('sequelize')
const db = require('../config/database')
const Usuario = require('./usuario')
const { primaryKeyAttribute } = require('./persona')

const Paciente = db.define('Paciente', {
    ID: {
        type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true
    },
    usuarioID: {
        type:DataTypes.INTEGER,
        allowNull:false,
        references:{
            model:Usuario,
            key:'id'
        }
    },
    obra_social:{
        type:DataTypes.STRING,
        allowNull:false
    },
    dato_contacto:{
        type:DataTypes.STRING,
        allowNull:false
    }
},{
    tableName:'pacientes',
    timestamps:false
})

Paciente.belongsTo(Usuario,{foreignKey:'usuarioID'})

module.exports = Paciente