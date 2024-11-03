const DataTypes = require('sequelize')
const db = require('../config/database')

const Sucursal = db.define('Sucursal',{
    ID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      nombre:{
        type:DataTypes.STRING(40),
        allowNull:false
      },
      ciudad:{
        type:DataTypes.STRING(40),
        allowNull:false
      }
}, {
    tableName: 'sucursales',
    timestamps:false
});

module.exports = Sucursal;