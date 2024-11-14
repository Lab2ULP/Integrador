const express = require('express');
const router = express.Router();
const especialidadController = require('../controllers/especialidadController');

router.get('/:id', especialidadController.obtenerEspecialidadConProfesionales);

module.exports = router;