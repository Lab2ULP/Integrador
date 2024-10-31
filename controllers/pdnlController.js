// PROFESIONAL DIAS NO LABORABLES CONTROLADOR
const { Profesional, DiasNoLaborables, ProfesionalDiasNoLaborables, Persona } = require('../models/main');

// Renderizar la vista para agregar un día no laborable
exports.renderAgregarDiaNoLaborable = async (req, res) => {
  try {
    const profesionales = await Profesional.findAll({
      include: [
        {
          model: Persona,
          as: 'persona', // Usa el alias aquí
          attributes: ['nombre'] // Traemos solo el nombre de la persona
        }
      ]
    });
    // Asegúrate de pasar profesionales como una propiedad del objeto
    res.render('agregardianl', { profesionales });
  } catch (error) {
    console.error('Error al obtener profesionales:', error);
    res.status(500).json({ error: 'Error al obtener profesionales' });
  }
};

// Agregar un día no laborable a un profesional
exports.addDiaNoLaborable = async (req, res) => {
  try {
    // Muestra los datos recibidos en el cuerpo de la solicitud
    console.log("Datos recibidos en el formulario:", req.body);

    // Extrae los datos del formulario
    const { nombre, profesionalID, diaNoLaborableID, fecha } = req.body;

    // Verifica si los datos están completos
    if (!nombre || !profesionalID || !diaNoLaborableID || !fecha) {
      console.log("Faltan datos en la solicitud");
      return res.status(400).json({ error: 'Faltan datos para agregar el día no laborable' });
    }

    // Crea la relación en la tabla intermedia
    const nuevoDiaNoLaborable = await ProfesionalDiasNoLaborables.create({
      nombre,
      profesionalID,
      dia_no_laborablesID: diaNoLaborableID, // Asegúrate de usar el nombre correcto
      fecha
    });

    // Verifica que se haya creado la relación
    console.log("Nuevo día no laborable creado:", nuevoDiaNoLaborable);

    // Envía una respuesta de éxito
    res.redirect(`/noLaborables/profesional/${profesionalID}`);
  //  res.status(201).json({ message: 'Día no laborable agregado correctamente', nuevoDiaNoLaborable });
  } catch (error) {
    console.error("Error al agregar día no laborable:", error);
    res.status(500).json({ error: 'Error al agregar día no laborable' });
  }
};



exports.removeDiaNoLaborable = async (req, res) => {
  try {
    const { ID } = req.params; // Obtiene el ID del parámetro de la solicitud
    console.log(`Recibido ID para eliminar: ${ID}`);

    // Elimina la relación usando el método destroy de Sequelize
    const deletedRows = await ProfesionalDiasNoLaborables.destroy({
      where: { ID } // Condición para eliminar el registro
    });
    
    console.log(`Número de registros eliminados: ${deletedRows}`);

    // Verificamos si se eliminó algún registro
    if (deletedRows === 0) {
      console.log('Relación no encontrada para el ID:', ID);
      return res.status(404).json({ error: 'Relación no encontrada' });
    }

    console.log('Día no laborable eliminado exitosamente para el ID:', ID);
    // Respuesta exitosa
    res.status(200).json({ message: 'Día no laborable eliminado del profesional' });
  } catch (error) {
    console.error('Error al eliminar día no laborable:', error); // Muestra el error en la consola para depuración
    res.status(500).json({ error: 'Error al eliminar día no laborable' }); // Manejo de errores
  }
};



// Obtener todos los días no laborables de un profesional
exports.getDiasNoLaborablesByProfesional = async (req, res) => {
  try {
    const { profesionalID } = req.params; // Asumimos que pasas el ID del profesional en los parámetros de la ruta

    // Consulta que trae el profesional con todos sus días no laborables
    const profesionalDiasNoLaborables = await Profesional.findAll({
      where: { ID: profesionalID },
      include: [
        {
          model: Persona,
          as: 'persona',
          attributes: ['nombre']
        },
        {
          model: DiasNoLaborables,
          as: 'diasNoLaborables',
          through: { 
            attributes: ['fecha'] // Incluye la fecha de la tabla intermedia
          }
        }
      ]
    });

    if (profesionalDiasNoLaborables.length === 0) {
      return res.status(404).send('Profesional no encontrado o sin días no laborables');
    }

 //   res.json(profesionalDiasNoLaborables);
    res.render('profesionaldnl',{profesionalDiasNoLaborables});
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al obtener los días no laborables del profesional');
  }
};





