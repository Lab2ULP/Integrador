const express = require('express');
const router = express.Router();
const profesionalController = require('../controllers/profesionalController');
const verificarRol = require('../middelwares/verificarRol');

// Ruta para obtener todos los días no laborables de un profesional específico
router.get('/profesionalesDnl',verificarRol([1]) ,profesionalController.getAllProfesionalDiasNoLaborables); //RUTA DE VISTA DIAS NO LABORABLES
// Definimos la ruta para obtener todos los profesionales con sus especialidades
router.get('/lista', verificarRol([1]) ,profesionalController.getProfesionalesConEspecialidades);
router.get('/edit/:id',verificarRol([1]),profesionalController.renderEditarProfesional)
router.post('/editar/:id',verificarRol([1]),profesionalController.editarProfesional)
router.post('/statechange',verificarRol([1]),profesionalController.actualizarEstado)
router.get('/crear',verificarRol([1]),profesionalController.renderCrear)
router.post('/crear',verificarRol([1]),profesionalController.crearProfesional)
router.post('/agregarEspecialidad/:id',verificarRol([1]),profesionalController.sumarEspecialidad)
router.post('/borrarEspecialidad',verificarRol([1]),profesionalController.borrarEspecialidad)

module.exports = router;