const express = require('express');
const router = express.Router();
const agendaController = require('../controllers/agendaController');
const verificarRol = require('../middelwares/verificarRol');

router.get('/lista/agendas',verificarRol([2]),agendaController.listarAgendas)
router.post('/lista/agendas/:ID',verificarRol([2]),agendaController.actualizarTurnos)
router.get('/crear',verificarRol([2]),agendaController.renderCrearAgenda)
router.post('/crear',verificarRol([2]),agendaController.crearAgenda)
router.get('/agenda/:ID/:Pid',verificarRol([2]),agendaController.listarTurnos)
router.post('/turnos/actualizarEstado',verificarRol([2]),agendaController.actualizarTurnos)
module.exports = router;