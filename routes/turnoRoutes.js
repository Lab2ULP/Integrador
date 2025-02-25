const express = require('express');
const router = express.Router();
const turnoController = require('../controllers/turnoController');

// Obtener todos los turnos
router.get('/todos', turnoController.obtenerTodosTurnos);

// Actualizar el estado de un turno
router.post('/actualizarEstado', turnoController.actualizarEstadoTurno);

// Eliminar un turno
router.post('/eliminar', turnoController.eliminarTurno);

router.post('/reservar/:ID',turnoController.reservarTurno);

router.get('/secretario/turnos/crearSobreturno/:ID', turnoController.mostrarFormularioSobreturno);

// Ruta para procesar la creación del sobreturno
router.post('/secretario/turnos/crearSobreturno', turnoController.crearSobreturno);

// Otras rutas relacionadas pueden agregarse aquí si es necesario

module.exports = router;