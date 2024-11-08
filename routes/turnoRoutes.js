const express = require('express');
const router = express.Router();
const turnoController = require('../controllers/turnoController');

// Rutas para manejar turnos
// Obtener todos los turnos
router.get('/todos', turnoController.obtenerTodosTurnos);

// Agregar un nuevo turno
router.post('/agregar', turnoController.agregarTurno);

// Actualizar el estado de un turno
router.post('/actualizarEstado', turnoController.actualizarEstadoTurno);

// Eliminar un turno
router.post('/eliminar', turnoController.eliminarTurno);

// Otras rutas relacionadas pueden agregarse aquí si es necesario

module.exports = router;
