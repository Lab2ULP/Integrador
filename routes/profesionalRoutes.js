const express = require('express');
const router = express.Router();
const profesionalController = require('../controllers/profesionalController');

// Ruta para obtener todos los días no laborables de un profesional específico
router.get('/profesionales', profesionalController.getAllProfesionalDiasNoLaborables);

module.exports = router;