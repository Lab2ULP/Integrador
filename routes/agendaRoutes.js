const express = require('express');
const router = express.Router();
const agendaController = require('../controllers/agendaController');

router.get('/lista/agendas',agendaController.listarAgendas)
router.get('/crear',agendaController.renderCrearAgenda)
router.post('/crear',agendaController.crearAgenda)
router.get('/agenda/:ID/:Pid',agendaController.listarTurnos)
module.exports = router;