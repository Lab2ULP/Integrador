const { DataTypes } = require('sequelize')
const sequelize = require('../config/database');
const Persona = require('./persona');

const Profesional = sequelize.define('Profesional', {
    ID:{
        type: DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true
    },
    personaID: {
        type:DataTypes.INTEGER,
        allowNull:false,
        references: {
            model:Persona,
            key:'ID'
        }
    }
}, {
    tableName:'profesionales',
    timestamps:false
})

Profesional.belongsTo(Persona,{foreignKey:'personaID',as:'persona'})
module.exports = Profesional;