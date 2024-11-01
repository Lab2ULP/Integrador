const DataTypes = require('sequelize')
const db = require('../config/database')

const Clasificacion = db.define('Clasificacion',{
    ID:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true  
    },
    nombre:{
        type:DataTypes.STRING(15),
        allowNull:false
    },
    especialiad:{
        type:DataTypes.BOOLEAN,
        allowNull:false
    }
}, {
    tableName:'clasificaciones',
    timestamps:false
})

module.exports = Clasificacion;