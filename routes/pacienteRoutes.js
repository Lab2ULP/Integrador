
const express = require('express');
const router = express.Router();
const pacienteController = require('../controllers/pacienteController');


router.get('/crear',(req, res) => {
    res.render('crearPaciente');
});

router.post('/crear',pacienteController.crearPaciente);
router.get('/principal',pacienteController.principalRender);
router.get('/obtenerByEspecialidad/:especialidadID',pacienteController.getProfesionalesByEspecialidad)
router.get('/obtenerTurnos/:profesionalID/:especialidadID', pacienteController.getTurnosByProfesionalAndEspecialidad);


module.exports = router;

