// PROFESIONAL DIAS NO LABORABLES RUTAS
const express = require('express');
const router = express.Router();
const pdnlController = require('../controllers/pdnlController');

// Ruta para mostrar el formulario para agregar un día no laborable
router.get('/agregar', pdnlController.renderAgregarDiaNoLaborable);

// Ruta para agregar un nuevo día no laborable (maneja el envío del formulario)
router.post('/add', pdnlController.addDiaNoLaborable);

// Ruta para eliminar un día no laborable de un profesional
router.delete('/remove/:ID', pdnlController.removeDiaNoLaborable);

// Ruta para obtener todos los días no laborables de un profesional específico
router.get('/profesional/:profesionalID', pdnlController.getDiasNoLaborablesByProfesional);

module.exports = router;
