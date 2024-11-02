// PROFESIONAL DIAS NO LABORABLES RUTAS
const express = require('express');
const router = express.Router();
const pdnlController = require('../controllers/pdnlController');

// Ruta para mostrar el formulario para agregar un día no laborable
router.get('/agregar', pdnlController.renderAgregarDiaNoLaborable);

// Ruta para agregar un nuevo día no laborable (maneja el envío del formulario)
router.post('/add', pdnlController.addDiaNoLaborable);

// Cambia la ruta para eliminar un día no laborable de un profesional a POST
router.post('/remove', pdnlController.removeDiaNoLaborable);



module.exports = router;
