const express = require('express');
const router = express.Router();
const pacienteController = require('../controllers/pacienteController');
const verificarRol = require('../middelwares/verificarRol');

router.get('/crear',(req, res) => {
    res.render('crearPaciente');
});

router.post('/crear',pacienteController.crearPaciente);
router.get('/principal',verificarRol([3]),pacienteController.principalRender);
router.get('/obtenerByEspecialidad/:especialidadID', verificarRol([3]), pacienteController.getProfesionalesByEspecialidad);
router.get('/obtenerTurnos/:profesionalID/:especialidadID',verificarRol([3]),pacienteController.getTurnosByProfesionalAndEspecialidad);

module.exports = router;