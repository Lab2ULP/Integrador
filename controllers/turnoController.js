const { Turno, Agenda, Paciente } = require('../models/main');

// Obtener todos los turnos
exports.obtenerTodosTurnos = async (req, res) => {
  try {
    const turnos = await Turno.findAll({
      include: [
        { model: Agenda },
        { model: Paciente }
      ]
    });

    const tipoTurnos = Turno.rawAttributes.estado_turno.values.map(value => {
        return { nombre: value }; // Generar un objeto para cada valor ENUM
      });
      
  //  console.log(tipoTurnos);
    res.render('turno', { turnos, tipoTurnos });
  //res.json(tipoTurnos);
  } catch (error) {
    console.error("Error al obtener los turnos:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};


// Actualizar el estado de un turno
exports.actualizarEstadoTurno = async (req, res) => {
  try {
    const { ID, fecha, hora_inicio, hora_final, motivo, estado_turno } = req.body;

    // Validar que el ID esté presente
    if (!ID) {
      return res.status(400).json({ error: "ID es obligatorio" });
    }

    // Validar que estado_turno sea uno de los valores válidos del ENUM
    const validStates = Turno.rawAttributes.estado_turno.values;
    if (!validStates.includes(estado_turno)) {
      return res.status(400).json({ error: `Estado de turno no válido. Valores válidos: ${validStates.join(', ')}` });
    }

    // Actualizar solo los campos permitidos
    const updateFields = { estado_turno };

    // Remover campos undefined o null para evitar actualizaciones innecesarias
    Object.keys(updateFields).forEach((key) => {
      if (updateFields[key] === undefined || updateFields[key] === null) {
        delete updateFields[key];
      }
    });

    // Ejecutar la actualización en la base de datos
    const [updated] = await Turno.update(updateFields, 
      { 
        where: { ID: ID } 
      }
    );

    if (updated === 0) {
      return res.status(404).json({ error: "Turno no encontrado" });
    }

    res.redirect('/turnos/todos');
  } catch (error) {
    console.error("Error al actualizar el turno:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};


// Eliminar un turno
exports.eliminarTurno = async (req, res) => {
    try {

      const { ID } = req.body;
  
      // Intentar eliminar el turno
      const eliminado = await Turno.destroy({ 
        where: { 
            ID: ID
         }  // Puedes escribir simplemente { ID } en lugar de { ID: ID }
      });

      // Redirigir después de eliminar
      res.redirect('/turnos/todos');
    } catch (error) {
      console.error("Error al eliminar el turno:", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
}; 
  
exports.reservarTurno = async (req, res) => {
    try {
      const ID = req.body
  
      const estado_turno = "Reservado"
      

      res.redirect('/pacientes/principal');
    } catch (error) {
      console.error("Error al actualizar el turno:", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
};
