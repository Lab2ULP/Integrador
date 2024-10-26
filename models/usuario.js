// /models/usuario.js
const { DataTypes } = require('sequelize');
const db = require('../config/database');
const bcrypt = require('bcrypt');
const Persona = require('./persona');
const Rol = require('./rol');

const Usuario = db.define('Usuario', {
  ID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  personaID: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Persona,
      key: 'id'
    }
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
    validate: {
      isEmail: true
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  rolID: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Rol,
      key: 'id'
    }
  }
}, {
  tableName: 'usuarios',
  timestamps:false,
  hooks: {
    beforeCreate: async (usuario) => {
      // Encriptar contraseña antes de guardar
      const salt = await bcrypt.genSalt(10);
      usuario.password = await bcrypt.hash(usuario.password, salt);
    }
  }
});

// Definir relaciones
Usuario.belongsTo(Persona, { foreignKey: 'personaID' });
Usuario.belongsTo(Rol, { foreignKey: 'rolID' });

module.exports = Usuario;
