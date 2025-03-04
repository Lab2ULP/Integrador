// PROFESIONAL DIAS NO LABORABLES CONTROLADOR
const { Profesional, DiasNoLaborables, Persona } = require('../models/main');
const  ProfesionalDiasNoLaborables = require('../models/profesionalDiasNoLaborables')

// Renderizar la vista para agregar un día no laborable
exports.renderAgregarDiaNoLaborable = async (req, res) => {
  try {
    const profesionales = await Profesional.findAll({
      include: [
        {
          model: Persona,
          attributes: ['nombre'] // Traemos solo el nombre de la persona
        }
      ]
    });
    // Asegúrate de pasar profesionales como una propiedad del objeto
    //  res.json(profesionales);
    res.render('agregardianl', { profesionales});
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

    // Envía una respuesta de éxito con un alert y redirige
    res.send(`
      <script>
        alert('Día no laborable agregado correctamente.');
        window.location.href = '/profesionales/profesionalesDnl'; // Redirige a la misma ruta
      </script>
    `);
  } catch (error) {
    console.error("Error al agregar día no laborable:", error);
    res.status(500).json({ error: 'Error al agregar día no laborable' });
  }
};



// Método para eliminar un día no laborable de un profesional con una solicitud POST
exports.removeDiaNoLaborable = async (req, res) => {
  try {
    const { ID } = req.body; // Tomar el ID exacto del registro en la tabla profesional_dias_no_laborables

    // Verificar que el ID esté presente en el cuerpo de la solicitud
    if (!ID) {
      console.log('Error: ID no proporcionado');
      return res.status(400).json({ error: 'ID no proporcionado' });
    }

    // Intentar eliminar el registro específico de la tabla profesional_dias_no_laborables
    const deletedRows = await ProfesionalDiasNoLaborables.destroy({
      where: {
        ID: ID // Usar el ID específico para eliminar
      }
    });

    // Verificar si se eliminó alguna fila
    if (deletedRows === 0) {
      console.log('Registro no encontrado para el ID:', ID);
      return res.status(404).json({ error: 'Registro no encontrado' });
    }

    console.log('Registro eliminado exitosamente para el ID:', ID);

    // Envía una respuesta de éxito con un alert y redirige
    res.send(`
      <script>
        alert('Día no laborable eliminado correctamente.');
        window.location.href = '/profesionales/profesionalesDnl'; // Redirige a la misma ruta
      </script>
    `);
  } catch (error) {
    console.error('Error al eliminar el registro:', error);
    res.status(500).json({ error: 'Error al eliminar el registro' });
  }
};







