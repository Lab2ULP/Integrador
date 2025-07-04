const {
  Persona,
  Usuario,
  Paciente,
  Turno,
  Agenda,
  Profesional,
  Especialidad,
  ProfesionalEspecialidad,
  Sucursal,
} = require("../models/main");
const { Op } = require("sequelize"); // Importar Op correctamente

exports.crearPaciente = async (req, res) => {
  const {
    nombre,
    dni,
    nacimiento,
    email,
    password,
    obra_social,
    dato_contacto,
  } = req.body;

  try {
    // Crear la persona primero
    const nuevaPersona = await Persona.create({ nombre, dni, nacimiento });

    // Crear el usuario con rol de Cliente, usando el personaID de la persona creada
    const nuevoUsuario = await Usuario.create({
      personaID: nuevaPersona.ID,
      email,
      password,

      rolID: 3, // Asumimos que el rol de 'Cliente' tiene ID 3
    });

    nuevoPaciente = await Paciente.create({
      usuarioID: nuevoUsuario.ID,
      obra_social: obra_social,
      dato_contacto: dato_contacto,
    });

    res.send(`
        <script>
          alert('Paciente creado correctamente.');
          window.location.href = '/'; // Redirige a la ruta principal
        </script>
      `);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al crear el paciente");
  }
};

exports.principalRender = async (req, res) => {
  const sucursalID = req.query.sucursal;
  req.session.sucursal = sucursalID;
  try {
    const especialidades = await Especialidad.findAll({
      attributes: ["ID", "nombre"],
    });

    //res.json(turnos)
    res.render("principalCliente", { especialidades });
  } catch (error) {
    console.error("Error al obtener los turnos:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

exports.getProfesionalesByEspecialidad = async (req, res) => {
  const { especialidadID } = req.params;
  const sucursalID = req.session.sucursal; // Usar la sucursal seleccionada
  const fechaActual = new Date();

  try {
    // Buscar solo los profesionales con agenda vigente en la sucursal y especialidad
    const profesionales = await ProfesionalEspecialidad.findAll({
      where: { especialidadID },
      include: [
        {
          model: Profesional,
          include: { model: Persona, attributes: ["nombre"] },
        },
        {
          model: Agenda,
          required: true, // Solo si tiene agenda
          where: {
            sucursalID: sucursalID,
            fecha_desde: { [Op.lte]: fechaActual },
            fecha_hasta: { [Op.gte]: fechaActual },
          },
        },
      ],
    });

    const resultado = profesionales.map((pe) => ({
      id: pe.Profesional.ID,
      nombre: pe.Profesional.Persona.nombre,
      especialidadProfesionalID: pe.ID,
    }));

    res.json(resultado);
  } catch (error) {
    console.error("Error al obtener profesionales:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

exports.getTurnosByProfesionalAndEspecialidad = async (req, res) => {
  const { profesionalID, especialidadID } = req.params;
  const sucursalId = req.session.sucursal;
  const fechaActual = new Date(); // Fecha actual en tu zona horaria
  const fechaFormateada = fechaActual.toISOString().split("T")[0]; // Formato: YYYY-MM-DD
  console.log(`Sucursal ID ${sucursalId}`);
  console.log(
    `profesionalID ${profesionalID}, especialidadID ${especialidadID}`
  );
  console.log(`Fecha actual ${fechaFormateada}`);

  try {
    // 1. Buscar el ID de la tabla `especialidades_profesionales` que coincide con el profesional y la especialidad
    const especialidadProfesional = await ProfesionalEspecialidad.findOne({
      where: {
        profesionalID,
        especialidadID,
      },
    });

    if (!especialidadProfesional) {
      return res.status(404).json({
        error:
          "No se encontró una relación entre el profesional y la especialidad.",
      });
    }

    // 2. Buscar la agenda que corresponde a este ID en `prof_especialidadID`
    const agenda = await Agenda.findOne({
      where: {
        prof_especialidadID: especialidadProfesional.ID,
        sucursalID: parseInt(sucursalId),
        fecha_desde: { [Op.lte]: fechaFormateada },
        fecha_hasta: { [Op.gte]: fechaFormateada },
      },
    });

    if (!agenda) {
      return res.status(404).json({
        error:
          "No se encontró una agenda asociada al profesional y especialidad seleccionados.",
      });
    }

    if (agenda.ID) {
      console.log(`ID de la agenda: ${agenda.ID}`);
    } else {
      console.log("No se encontró agenda");
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
              attributes: ["nombre"], // Obtén solo el nombre del paciente
            },
          },
          attributes: ["ID", "obra_social", "dato_contacto"], // Atributos de la tabla Paciente
        },
      ],
      attributes: [
        "ID",
        "fecha",
        "hora_inicio",
        "hora_final",
        "motivo",
        "estado_turno",
      ], // Atributos de la tabla Turno
    });

    // 4. Transformar los datos para enviar un JSON con la estructura deseada
    const turnosFormateados = turnos.map((turno) => ({
      ID: turno.ID,
      fecha: turno.fecha,
      hora_inicio: turno.hora_inicio,
      hora_final: turno.hora_final,
      estado: turno.estado_turno,
      paciente: turno.Paciente?.Usuario?.Persona?.nombre || "Sin asignar",
    }));

    return res.json(turnosFormateados);
  } catch (error) {
    console.error("Error al obtener los turnos:", error);
    return res
      .status(500)
      .json({ error: "Ocurrió un error al obtener los turnos." });
  }
};

exports.listarSucursales = async (req, res) => {
  try {
    // Consultar todas las sucursales en la base de datos
    const sucursales = await Sucursal.findAll();

    // Verificar si se encontraron sucursales
    if (sucursales.length === 0) {
      return res.status(404).json({ mensaje: "No se encontraron sucursales." });
    }

    // Enviar las sucursales como respuesta
    //res.status(200).json(sucursales);
    res.render("selectSucursalPaciente", { sucursales });
  } catch (error) {
    // Manejar errores
    console.error("Error al listar sucursales:", error);
    res.status(500).json({ mensaje: "Error interno del servidor." });
  }
};

exports.listarAgendas = async (req, res) => {
  const sucursalId = req.query.sucursal;
  const fechaActual = new Date();
  console.log(`Sucursal ID: ${sucursalId}`);
  try {
    //TO DO: Modificarlo para que busque las agendas segun la variable sucursalId
    const agendas = await Agenda.findAll({
      where: {
        sucursalID: sucursalId,
        fecha_desde: { [Op.lte]: fechaActual },
        fecha_hasta: { [Op.gte]: fechaActual },
      },
      attributes: [
        "ID",
        "sobre_turnos_limites",
        "prof_especialidadID",
        "sucursalID",
        "duracion_turnos",
        "fecha_desde",
        "fecha_hasta",
      ],
      include: [
        {
          model: ProfesionalEspecialidad,
          as: "EspecialidadesProfesionale",
          attributes: ["ID"],
          include: [
            {
              model: Profesional,
              attributes: ["ID"],
              include: [
                {
                  model: Persona,
                  attributes: ["nombre"],
                },
              ],
            },
            {
              model: Especialidad,
              attributes: ["nombre"],
            },
          ],
        },
      ],
    });
    //res.json(agendas[0].EspecialidadesProfesionale)
    res.render("listaMedicos", { agendas });
  } catch (error) {
    console.error(
      "Error al obtner las especialidades relacionadas a los profesionales",
      error
    );
  }
};

exports.listarTurnos = async (req, res) => {
  try {
    // 1. Buscar el paciente cuyo usuarioID coincide con el usuario logueado
    const paciente = await Paciente.findOne({
      where: { usuarioID: req.session.userId },
    });
    if (!paciente) {
      return res.status(404).send("Paciente no encontrado");
    }

    // 2. Buscar todos los turnos de ese paciente
    const turnos = await Turno.findAll({
      where: { pacienteID: paciente.ID },
      include: [
        {
          model: Agenda,
          include: [
            {
              model: ProfesionalEspecialidad,
              include: [
                {
                  model: Profesional,
                  include: [
                    {
                      model: Persona,
                      attributes: ["nombre"],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    });

    // 3. Renderizar la vista o devolver los turnos
    res.render("turnosPaciente", { turnos }); // Cambiá el nombre de la vista si es necesario
    //res.json(turnos); // Si querés devolverlo como JSON, descomenta esta línea
    // O si es API: res.json(turnos);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al obtener los turnos");
  }
};

exports.getInfoPaciente = async (req, res) => {
  try {
    // Buscar el paciente cuyo usuarioID coincide con el usuario logueado
    const paciente = await Paciente.findOne({
      where: { usuarioID: req.session.userId },
      include: [
        {
          model: Usuario,
          attributes: ["email"],
          include: {
            model: Persona,
            attributes: ["nombre", "dni", "nacimiento"],
          },
        },
      ],
    });

    if (!paciente) {
      return res.status(404).send("Paciente no encontrado");
    }

    // Enviar la información del paciente
    //res.json(paciente);
    res.render("infoPaciente", { paciente });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al obtener la información del paciente");
  }
};
