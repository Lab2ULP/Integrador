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

// Agregar un turno nuevo
exports.agregarTurno = async (req, res) => {
  try {
    const { agendaID, fecha, hora_inicio, hora_final, motivo, pacienteID, estado_turno } = req.body;

    // Validación de datos
    if (!agendaID || !fecha || !hora_inicio || !hora_final || !motivo || !pacienteID || !estado_turno) {
      return res.status(400).json({ error: "Todos los campos son obligatorios" });
    }

    // Verificar que el estado_turno es uno de los valores válidos del ENUM
    const validStates = Object.values(Turno.rawAttributes.estado_turno.values);
    if (!validStates.includes(estado_turno)) {
      return res.status(400).json({ error: `Estado de turno no válido. Valores válidos: ${validStates.join(', ')}` });
    }

    // Crear el nuevo turno
    await Turno.create({
      agendaID,
      fecha,
      hora_inicio,
      hora_final,
      motivo,
      pacienteID,
      estado_turno
    });

    res.redirect('/turnos/todos');
  } catch (error) {
    console.error("Error al agregar un turno:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// Actualizar el estado de un turno
exports.actualizarEstadoTurno = async (req, res) => {
  try {
    const { ID, estado_turno } = req.body;

    // Verificar que el estado_turno es uno de los valores válidos del ENUM
    const validStates = Object.values(Turno.rawAttributes.estado_turno.values);
    if (!validStates.includes(estado_turno)) {
      return res.status(400).json({ error: `Estado de turno no válido. Valores válidos: ${validStates.join(', ')}` });
    }

    // Validar que ID y estado_turno estén presentes
    if (!ID || !estado_turno) {
      return res.status(400).json({ error: "ID y estado_turno son obligatorios" });
    }

    // Actualizar el estado del turno
    await Turno.update({ estado_turno }, { where: { ID } });

    res.redirect('/turnos/todos');
  } catch (error) {
    console.error("Error al actualizar el estado del turno:", error);
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
  

