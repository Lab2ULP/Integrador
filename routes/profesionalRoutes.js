const express = require('express');
const router = express.Router();
const profesionalController = require('../controllers/profesionalController');

// Definimos la ruta para obtener todos los profesionales con sus especialidades
router.get('/profesionales', profesionalController.getProfesionalesConEspecialidades);
router.get('/edit/:id',profesionalController.renderEditarProfesional)
router.post('/edit/:id',profesionalController.editarProfesional)
router.post('/statechange',profesionalController.actualizarEstado)
router.get('/crear',profesionalController.renderCrear)

module.exports = router;
