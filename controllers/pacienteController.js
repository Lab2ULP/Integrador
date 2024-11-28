const { Persona, Usuario, Paciente,Turno,Agenda,Profesional,Especialidad,ProfesionalEspecialidad } = require('../models/main');


exports.crearPaciente = async(req,res)=>{
    const { nombre, dni, nacimiento, email, password, obra_social, dato_contacto } = req.body;
    
    try{

    // Crear la persona primero
    const nuevaPersona = await Persona.create({ nombre, dni, nacimiento });

    // Crear el usuario con rol de Cliente, usando el personaID de la persona creada
    const nuevoUsuario = await Usuario.create({
      personaID: nuevaPersona.ID,
      email,
      password,

      rolID: 3 // Asumimos que el rol de 'Cliente' tiene ID 3
    });

    nuevoPaciente = Paciente.create({
        usuarioID:nuevoUsuario.ID,
        obra_social:obra_social,
        dato_contacto:dato_contacto
    });

    res.redirect('/')

    }catch(error){
        console.error(error);
        res.status(500).send('Error al crear el paciente');
    }
}

exports.principalRender = async(req,res)=>{
    try {
        const especialidades = await Especialidad.findAll({
            attributes:['ID','nombre']
        })

        //res.json(turnos)
        res.render('principalCliente',{especialidades})
      } catch (error) {
        console.error("Error al obtener los turnos:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
}

exports.getProfesionalesByEspecialidad = async (req, res) => {
  const { especialidadID } = req.params;

  try {
      const profesionales = await ProfesionalEspecialidad.findAll({
          where: { especialidadID },
          include: {
              model: Profesional,
              include: { model: Persona, attributes: ['nombre'] } // Obtener el nombre
          }
      });

      const resultado = profesionales.map(pe => ({
          id: pe.Profesional.ID, // ID del profesional
          nombre: pe.Profesional.Persona.nombre, // Nombre del profesional
          especialidadProfesionalID: pe.ID // ID de la tabla especialidades_profesionales
      }));

      res.json(resultado);
  } catch (error) {
      console.error("Error al obtener profesionales:", error);
      res.status(500).json({ error: "Error interno del servidor" });
  }
};


exports.getTurnosByProfesionalAndEspecialidad = async (req, res) => {
  const { profesionalID, especialidadID } = req.params;

  try {
      // 1. Buscar el ID de la tabla `especialidades_profesionales` que coincide con el profesional y la especialidad
      const especialidadProfesional = await ProfesionalEspecialidad.findOne({
          where: {
              profesionalID,
              especialidadID,
          },
      });

      if (!especialidadProfesional) {
          return res.status(404).json({ error: 'No se encontró una relación entre el profesional y la especialidad.' });
      }

      // 2. Buscar la agenda que corresponde a este ID en `prof_especialidadID`
      const agenda = await Agenda.findOne({
          where: {
              prof_especialidadID: especialidadProfesional.ID,
          },
      });

      if (!agenda) {
          return res.status(404).json({ error: 'No se encontró una agenda asociada al profesional y especialidad seleccionados.' });
      }

      // 3. Buscar los turnos asociados a la agenda
      const turnos = await Turno.findAll({
          where: {
              agendaID: agenda.ID,
          },
          include: [
              {
                  model: Paciente,
                  include: {
                      model: Usuario,
                      include: {
                          model: Persona,
                          attributes: ['nombre'], // Obtén solo el nombre del paciente
                      },
                  },
                  attributes: ['ID', 'obra_social', 'dato_contacto'], // Atributos de la tabla Paciente
              },
          ],
          attributes: ['ID', 'fecha', 'hora_inicio', 'hora_final', 'motivo', 'estado_turno'], // Atributos de la tabla Turno
      });

      // 4. Transformar los datos para enviar un JSON con la estructura deseada
      const turnosFormateados = turnos.map(turno => ({
          ID: turno.ID,
          fecha: turno.fecha,
          hora_inicio: turno.hora_inicio,
          hora_final: turno.hora_final,
          estado: turno.estado_turno,
          paciente: turno.Paciente?.Usuario?.Persona?.nombre || 'Sin asignar',
      }));

      return res.json(turnosFormateados);
  } catch (error) {
      console.error('Error al obtener los turnos:', error);
      return res.status(500).json({ error: 'Ocurrió un error al obtener los turnos.' });
  }
};