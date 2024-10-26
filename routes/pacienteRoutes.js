const express = require('express');
const router = express.Router();
const pacienteController = require('../controllers/pacienteController');

router.get('/crear',(req, res) => {
    res.render('crearPaciente');
});

router.post('/crear',pacienteController.crearPaciente);

module.exports = router;