const { DataTypes } = require('sequelize')
const db = require('../config/database')
const Usuario = require('./usuario')


const Paciente = db.define('Paciente',{
    ID:{
        type: DataTypes.INTEGER,

        primaryKey:true,
        autoIncrement:true
    },
    usuarioID: {
        type:DataTypes.INTEGER,
        allowNull:false,
        references:{
            model:Usuario,
            key:'ID'
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



module.exports = Paciente