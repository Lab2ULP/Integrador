const express = require('express');
const router = express.Router();
const clasificacionController = require('../controllers/clasificacionController');
const verificarRol = require('../middelwares/verificarRol');


router.get('/listar',verificarRol([1]),clasificacionController.listarClasificaciones);
router.post('/editar/:id',verificarRol([1]),clasificacionController.editar);
router.post('/agregar',verificarRol([1]),clasificacionController.crearClasificacion)

module.exports = router;