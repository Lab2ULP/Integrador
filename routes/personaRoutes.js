// /routes/personaRoutes.js
const express = require('express');
const router = express.Router();
const personaController = require('../controllers/personaController');

// Rutas para las personas
router.post('/', personaController.createPersona); // Crear una nueva persona
router.get('/', personaController.renderListaPersonas); // Obtener todas las personas
router.get('/crear', personaController.renderCrearPersona); // Vista para crear nueva persona
router.get('/:id', personaController.renderListaPersonas); // Obtener una persona por ID
router.get('/editar/:id', personaController.renderEditarPersona); // Vista para editar persona
router.get('/borrar/:id', personaController.renderBorrarPersona); // Vista para confirmar borrado
router.put('/:id', personaController.updatePersona); // Actualizar una persona
router.delete('/:id', personaController.deletePersona); // Eliminar una persona
router.post('/editar/:id', personaController.editarPersona); // editar persona
module.exports = router;
