//Controlador de profesionalEspecialidad.
const ProfesionalEspecialidad = require('../models/profesionalEspecialidad');

// Crear una nueva relación entre Profesional y Especialidad
exports.asignarEspecialidad = async (req, res) => {
  const { profesionalID, especialidadID, matricula } = req.body;

  try {
    await ProfesionalEspecialidad.create({ profesionalID, especialidadID, matricula });
    res.status(201).send('Especialidad asignada al profesional');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al asignar la especialidad');
  }
};

// Eliminar una relación específica entre Profesional y Especialidad
exports.eliminarEspecialidad = async (req, res) => {
  const { profesionalID, especialidadID } = req.params;

  try {
    await ProfesionalEspecialidad.destroy({
      where: { profesionalID, especialidadID }
    });
    res.send('Especialidad eliminada del profesional');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al eliminar la especialidad');
  }
};
