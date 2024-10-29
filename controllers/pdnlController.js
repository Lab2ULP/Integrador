// PROFESIONAL DIAS NO LABORABLES CONTROLADOR
const Profesional = require('../models/profesional');
const DiasNoLaborables = require('../models/diasNoLaborables');
const ProfesionalDiasNoLaborables = require('../models/profesionalDiasNoLaborables');

// Agregar un día no laborable a un profesional (vacaciones, feriados o imprevisto)
exports.addDiaNoLaborable = async (req, res) => {
  try {
    const { profesionalID, dia_no_laborablesID, fecha } = req.body;

    // Verifica si el profesional y el día no laborable existen
    const profesional = await Profesional.findByPk(profesionalID);
    const diaNoLaborable = await DiasNoLaborables.findByPk(dia_no_laborablesID);

    if (!profesional || !diaNoLaborable) {
      return res.status(404).json({ error: 'Profesional o día no laborable no encontrado' });
    }

    // Crea la relación en la tabla intermedia
    await ProfesionalDiasNoLaborables.create({ profesionalID, dia_no_laborablesID, fecha });

    res.status(201).json({ message: 'Día no laborable agregado al profesional' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al agregar día no laborable' });
  }
};

// Eliminar un día no laborable de un profesional
exports.removeDiaNoLaborable = async (req, res) => {
  try {
    const { id } = req.params;

    // Verifica si la relación existe en la tabla intermedia
    const relacion = await ProfesionalDiasNoLaborables.findByPk(id);

    if (!relacion) {
      return res.status(404).json({ error: 'Relación no encontrada' });
    }

    // Elimina la relación
    await relacion.destroy();

    res.status(200).json({ message: 'Día no laborable eliminado del profesional' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al eliminar día no laborable' });
  }
};

// Obtener todos los días no laborables de un profesional
exports.getDiasNoLaborablesByProfesional = async (req, res) => {
  try {
    const { profesionalID } = req.params;

    const profesional = await Profesional.findByPk(profesionalID, {
      include: {
        model: DiasNoLaborables,
        through: {
          attributes: ['fecha']
        }
      }
    });

    if (!profesional) {
      return res.status(404).json({ error: 'Profesional no encontrado' });
    }

    res.status(200).json(profesional);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener días no laborables del profesional' });
  }
};
