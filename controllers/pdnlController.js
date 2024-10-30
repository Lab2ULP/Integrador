// PROFESIONAL DIAS NO LABORABLES CONTROLADOR
const { Profesional, DiasNoLaborables, ProfesionalDiasNoLaborables, Persona } = require('../models/main');

exports.addDiaNoLaborable = async (req, res) => {
  try {
    const { nombre, fecha, profesionalID } = req.body; // Suponiendo que envías el nombre, fecha y ID del profesional desde tu formulario

    // Crea un nuevo día no laborable
    const nuevoDiaNoLaborable = await DiasNoLaborables.create({ nombre });

    // Agrega la relación en la tabla intermedia
    await ProfesionalDiasNoLaborables.create({
      profesionalID: profesionalID,
      dia_no_laborablesID: nuevoDiaNoLaborable.ID,
      fecha: fecha // Si estás almacenando la fecha en la tabla intermedia
    });

    // Redirige a la página donde se muestra la lista actualizada
    res.redirect('agregardianl'); // Cambia esta ruta a la que corresponda
  } catch (error) {
    console.error("Error al agregar el día no laborable:", error);
    res.status(500).send("Error al agregar el día no laborable");
  }
};


// Eliminar un día no laborable de un profesional
exports.removeDiaNoLaborable = async (req, res) => {
  try {
    const { ID } = req.params;

    // Verifica si la relación existe en la tabla intermedia
    const profesionalDiasNoLaborables = await ProfesionalDiasNoLaborables.findByPk(ID);

    if (!profesionalDiasNoLaborables) {
      return res.status(404).json({ error: 'Relación no encontrada' });
    }

    // Elimina la relación
    await profesionalDiasNoLaborables.destroy();

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

    // Consulta que trae el profesional con sus días no laborables
    const profesionalDiasNoLaborables = await Profesional.findByPk(profesionalID, {
      include: [
        {
          model: DiasNoLaborables,
          as: 'diasNoLaborables',
          through: { attributes: ['fecha'] }, // Cambia 'fecha' si es diferente en tu tabla intermedia
          attributes: ['ID', 'nombre']
        },
        {
          model: Persona,
          as: 'persona',
          attributes:['nombre']
        }
      ]
    });

    if (!profesionalDiasNoLaborables) {
      return res.status(404).send('Profesional no encontrado');
    }

    // Renderiza la vista Pug con los datos del profesional
    res.render('profesionaldnl', { profesionalDiasNoLaborables });
  //res.json(profesionalDiasNoLaborables);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al obtener los días no laborables del profesional');
  }
};
