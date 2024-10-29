const express = require('express');
const router = express.Router();
const profesionalController = require('../controllers/profesionalController');

// Definimos la ruta para obtener todos los profesionales con sus especialidades
router.get('/profesionales', profesionalController.getProfesionalesConEspecialidades);

module.exports = router;
