const express = require('express');
const router = express.Router();
const profesionalController = require('../controllers/profesionalController');

router.get('/:id', profesionalController.obtenerProfesionalConEspecialidades);

module.exports = router;
