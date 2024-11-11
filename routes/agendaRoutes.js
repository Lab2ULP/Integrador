const express = require('express');
const router = express.Router();
const agendaController = require('../controllers/agendaController');

router.get('/lista/agendas',agendaController.listarAgendas)
router.get('/lista/medicos',agendaController.listarMedicos)
router.get('/crear',agendaController.renderCrearAgenda)
router.post('/crear',agendaController.crearAgenda)

module.exports = router;