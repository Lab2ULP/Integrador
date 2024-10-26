// /routes/clienteRoutes.js
const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');

// Mostrar el formulario para crear un cliente
router.get('/crear', (req, res) => {
  res.render('crearUsuario');
});

// Manejar la creación del usuario
router.post('/crear', usuarioController.crearUsuario);

module.exports = router;