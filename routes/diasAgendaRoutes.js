const express = require('express');
const router = express.Router();
const diasAgendaController = require('../controllers/diasAgendaController');

// Ruta para agregar un nuevo registro en dias_agendas
router.post('/agregar/diasAgenda', diasAgendaController.agregarDiaAgenda);

// Ruta para actualizar un registro en dias_agendas
router.put('/actualizar', diasAgendaController.actualizarDiaAgenda);

// Ruta para eliminar un registro en dias_agendas
router.delete('/eliminar', diasAgendaController.eliminarDiaAgenda);

module.exports = router;