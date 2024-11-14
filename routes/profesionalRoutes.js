const express = require('express');
const router = express.Router();
const profesionalController = require('../controllers/profesionalController');


// Ruta para obtener todos los días no laborables de un profesional específico
router.get('/profesionalesDnl', profesionalController.getAllProfesionalDiasNoLaborables); //RUTA DE VISTA DIAS NO LABORABLES
// Definimos la ruta para obtener todos los profesionales con sus especialidades
router.get('/lista', profesionalController.getProfesionalesConEspecialidades);
router.get('/edit/:id',profesionalController.renderEditarProfesional)
router.post('/editar/:id',profesionalController.editarProfesional)
router.post('/statechange',profesionalController.actualizarEstado)
router.get('/crear',profesionalController.renderCrear)
router.post('/crear',profesionalController.crearProfesional)
router.post('/agregarEspecialidad/:id',profesionalController.sumarEspecialidad)
router.post('/borrarEspecialidad',profesionalController.borrarEspecialidad)

module.exports = router;