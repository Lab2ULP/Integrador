const express = require('express');
const router = express.Router();
const diasAgendaController = require('../controllers/diasAgendaController');
const verificarRol = require('../middelwares/verificarRol');

// Ruta para agregar un nuevo registro en dias_agendas
router.post('/agregar',verificarRol([1]), diasAgendaController.agregarDiaAgenda);

// Ruta para actualizar un registro en dias_agendas
router.post('/actualizar',verificarRol([1]) ,diasAgendaController.actualizarDiaAgenda);

// Ruta para eliminar un registro en dias_agendas
router.post('/eliminar',verificarRol([1]) ,diasAgendaController.eliminarDiaAgenda);

router.get('/todos',verificarRol([1]) ,diasAgendaController.obtenerTodosDiasAgendas);

module.exports = router;