const express = require('express');
const router = express.Router();
const agendaController = require('../controllers/agendaController');

router.get('/lista/agendas',agendaController.listarAgendas)
router.post('/lista/agendas/:ID',agendaController.actualizarTurnos)
router.get('/crear',agendaController.renderCrearAgenda)
router.post('/crear',agendaController.crearAgenda)
router.get('/agenda/:ID/:Pid',agendaController.listarTurnos)
router.post('/turnos/actualizarEstado',agendaController.actualizarTurnos)
module.exports = router;