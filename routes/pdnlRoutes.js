// PROFESIONAL DIAS NO LABORABLES RUTAS
const express = require('express');
const router = express.Router();
const pdnlController = require('../controllers/pdnlController');

// Rutas
router.post('/add', pdnlController.addDiaNoLaborable);
router.delete('/remove/:id', pdnlController.removeDiaNoLaborable);
router.get('/profesional/:profesionalID', pdnlController.getDiasNoLaborablesByProfesional);

module.exports = router;
