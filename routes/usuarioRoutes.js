// /routes/clienteRoutes.js
const express = require('express');
const router = express.Router();
const clienteController = require('../controllers/usuarioController');

// Mostrar el formulario para crear un cliente
router.get('/crear', (req, res) => {
  res.render('crearCliente');
});

// Manejar la creación del cliente
router.post('/crear', clienteController.crearUsuario);

module.exports = router;
