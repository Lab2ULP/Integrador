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

 
    res.send(`
      <script>
        alert('Turno actualizado con exito.');
        window.location.href = '/turnos/todos'; 
      </script>
    `);
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
      res.send(`
        <script>
          alert('Turno eliminado con exito.');
          window.location.href = '/turnos/todos'; 
        </script>
      `);
    } catch (error) {
      console.error("Error al eliminar el turno:", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
}; 
  
/*exports.reservarTurno = async (req, res) => {
  try {
    const { ID } = req.params; // Obtener el ID del turno desde los parámetros de la URL
    //const pacienteID = String(req.session.userId)
    const estado_turno = "Reservado";

    const paciente = Paciente.findOne({where:{usuarioID:req.session.userId}});

    const pacienteID = paciente.ID

    // Actualizar el estado del turno en la base de datos
    const resultado = await Turno.update(
      { estado_turno,pacienteID }, // Valores a actualizar
      {
        where: { ID }, // Condición para encontrar el turno
      }
    );

    if (resultado[0] === 0) {
      // Si no se actualizó ningún turno, significa que no se encontró el ID
      return res
        .status(404)
        .json({ error: "No se encontró el turno con el ID proporcionado." });
    }

    // Redirigir después de actualizar
    res.redirect('/pacientes/principal');
  } catch (error) {
    console.error("Error al actualizar el turno:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};
*/
exports.reservarTurno = async (req, res) => {
  try {
    const { ID } = req.params; // ID del turno desde la URL
    const estado_turno = "Reservado";

    // Buscar el paciente asociado al usuario actual
    const paciente = await Paciente.findOne({ where: { usuarioID: req.session.userId }});

    const pacienteID = paciente.ID; // Obtener el ID del paciente

    // Actualizar el estado del turno en la base de datos
    const resultado = await Turno.update(
      { estado_turno, pacienteID }, // Valores a actualizar
      { where: { ID } } // Condición para encontrar el turno
    );

    // Redirigir después de actualizar correctamente

    res.redirect('/pacientes/sucursal');

    res.send(`
      <script>
        alert('Reserva realizada con exito.');
        window.location.href = '/pacientes/principal'; 
      </script>
    `);

  } catch (error) {
    console.error("Error al actualizar el turno:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

exports.mostrarFormularioSobreturno = async (req, res) => {
  const turnoID = req.params.ID;

  try {
    // Obtener los datos del turno
    const turno = await Turno.findByPk(turnoID, {
      include: [
        {
          model: agenda,
          attributes: ['sobre_turnos_limites'], // Obtener el límite de sobreturnos
        },
      ],
    });

    if (!turno) {
      return res.status(404).send('Turno no encontrado');
    }

    // Obtener los pacientes disponibles
    const pacientes = await Paciente.findAll({
      include: [
        {
          model: usuario,
          include: [
            {
              model: Persona,
              attributes: ['nombre', 'dni'],
            },
          ],
        },
      ],
    });

    // Renderizar la vista del formulario de sobreturno
    res.render('formularioSobreTurno', {
      turno,
      pacientes,
      sobreturnosDisponibles: turno.agenda.sobre_turnos_limites,
    });
  } catch (error) {
    console.error('Error al mostrar el formulario de sobreturno:', error);
    res.status(500).send('Error al mostrar el formulario de sobreturno');
  }
};

exports.crearSobreturno = async (req, res) => {
  const { agendaID, fecha, hora_inicio, hora_final, pacienteID } = req.body;

  try {
    // Obtener la agenda para verificar el límite de sobreturnos
    const agenda = await Agenda.findByPk(agendaID);

    if (!agenda) {
      return res.status(404).send('Agenda no encontrada');
    }

    // Verificar si aún hay sobreturnos disponibles
    if (agenda.sobre_turnos_limites <= 0) {
      return res.send(`
        <script>
          alert('No hay más sobreturnos disponibles.');
          window.close(); // Cerrar la pestaña actual
        </script>
      `);
    }

    // Crear el sobreturno
    await Turno.create({
      ID,
      fecha,
      hora_inicio,
      hora_final,
      pacienteID,
      estado_turno: 'sobreturno',
    });

    // Descontar el límite de sobreturnos
    await Agenda.update(
      { sobre_turnos_limites: agenda.sobre_turnos_limites - 1 },
      { where: { ID: ID } }
    );

    // Mostrar un mensaje de éxito y cerrar la pestaña
    res.send(`
      <script>
        alert('Sobreturno creado correctamente.');
        window.close(); // Cerrar la pestaña actual
      </script>
    `);
  } catch (error) {
    console.error('Error al crear el sobreturno:', error);
    res.status(500).send('Error al crear el sobreturno');
  }
};