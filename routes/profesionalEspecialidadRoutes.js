const express = require('express');
const router = express.Router();
const profesionalEspecialidadController = require('../controllers/profesionalEspecialidadController');

// Asignar una especialidad a un profesional
router.post('/asignar', profesionalEspecialidadController.asignarEspecialidad);

// Eliminar una especialidad de un profesional
router.delete('/eliminar/:profesionalID/:especialidadID', profesionalEspecialidadController.eliminarEspecialidad);

module.exports = router;