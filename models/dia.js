const DataTypes = require('sequelize')
const db = require('../config/database')

const Dia = db.define('Dia',{
    ID: {
        type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true
    },
    nombre:{
        type:DataTypes.STRING(10),
        allowNull:false
    }
}, {
    tableName:'dias',
    timestamps:false
});

module.exports = Dia