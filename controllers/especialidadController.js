const Especialidad = require('../models/especialidad');
const Profesional = require('../models/profesional');

// Obtener una especialidad con todos los profesionales que la tienen
exports.obtenerEspecialidadConProfesionales = async (req, res) => {
  const especialidadID = req.params.id;

  try {
    const especialidad = await Especialidad.findOne({
      where: { id: especialidadID },
      include: [{ model: Profesional }]
    });

    if (!especialidad) {
      return res.status(404).send('Especialidad no encontrada');
    }

    res.render('detallesEspecialidad', { especialidad }); // Renderiza una vista o envía la respuesta JSON
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al obtener la especialidad');
  }
};
