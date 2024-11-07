const express = require('express');
const router = express.Router();
const agendaController = require('../controllers/agendaController');

router.get('/lista/agendas',agendaController.listarAgendas)
router.get('/lista/medicos',agendaController.listarMedicos)

module.exports = router;