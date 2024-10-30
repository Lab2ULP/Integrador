const express = require('express');
const router = express.Router();
const profesionalController = require('../controllers/profesionalController');

// Definimos la ruta para obtener todos los profesionales con sus especialidades
router.get('/profesionales', profesionalController.getProfesionalesConEspecialidades);
router.get('/edit/:id',profesionalController.renderEditarProfesional)
router.post('/editar/:id',profesionalController.editarProfesional)
router.post('/statechange',profesionalController.actualizarEstado)
router.get('/crear',profesionalController.renderCrear)
router.post('/crear',profesionalController.crearProfesional)
router.post('/agregarEspecialidad/:id',profesionalController.sumarEspecialidad)
router.post('/borrarEspecialidad',profesionalController.borrarEspecialidad)

module.exports = router;
