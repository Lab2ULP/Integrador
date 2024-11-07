const express = require('express');
const router = express.Router();
const diasAgendaController = require('../controllers/diasAgendaController');

// Ruta para agregar un nuevo registro en dias_agendas
router.post('/agregar', diasAgendaController.agregarDiaAgenda);

// Ruta para actualizar un registro en dias_agendas
router.post('/actualizar', diasAgendaController.actualizarDiaAgenda);

// Ruta para eliminar un registro en dias_agendas
router.post('/eliminar', diasAgendaController.eliminarDiaAgenda);

router.get('/todos', diasAgendaController.obtenerTodosDiasAgendas);

module.exports = router;