// /routes/clienteRoutes.js
const express = require('express');
const router = express.Router();
const pacienteController = require('../controllers/pacienteController');

// Mostrar el formulario para crear un cliente
router.get('/crear', (req, res) => {
  res.render('crearPaciente');
});

// Manejar la creación del usuario
router.post('/crear', pacienteController.crearPaciente);

module.exports = router;
