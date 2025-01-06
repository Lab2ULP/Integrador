const express = require('express');
const router = express.Router();
const clasificacionController = require('../controllers/clasificacionController');

router.get('/listar',clasificacionController.listarClasificaciones);
router.post('/editar/:id',clasificacionController.editar);
router.post('/agregar',clasificacionController.crearClasificacion)

module.exports = router;