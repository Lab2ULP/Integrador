const { Clasificacion, AgendaDia, Agenda, AgendaClasificacion, Profesional, Especialidad, ProfesionalEspecialidad, Persona, Sucursal, Dia, Turno, Paciente,ProfesionalDiasNoLaborables,Usuario } = require('../models/main');
const { calcularTurnos, sumarUnDia } = require('../utils/funciones');
const sequelize = require('../config/database');
const { Op } = require('sequelize');  // Importar Op correctamente

exports.listarTurnos = async (req, res) => {
  const agendaID = req.params.ID;
  const profesionalID = req.params.Pid;

  try {
    // Obtener los días no laborables para el profesional
    const diasNoLaborables = await ProfesionalDiasNoLaborables.findAll({
      attributes: ['fecha'],
      where: { profesionalID: profesionalID }
    });

    const fechasNoLaborables = diasNoLaborables.map(dia => dia.fecha);

    // Obtener los turnos que no caen en días no laborables
    const whereConditions = { agendaID: agendaID };
    
    // Solo agregar el filtro de fechas no laborables si existe algún valor en fechasNoLaborables
    if (fechasNoLaborables.length > 0) {
      whereConditions.fecha = { [Op.notIn]: fechasNoLaborables };
    }

    const turnos = await Turno.findAll({
      where: whereConditions,
      attributes: ['ID', 'agendaID', 'fecha', 'hora_inicio', 'hora_final', 'motivo', 'pacienteID', 'estado_turno']
    });

    // Obtener los valores posibles del estado del turno
    const tipoTurnos = Turno.rawAttributes.estado_turno.values.map(value => {
      return { nombre: value }; // Generar un objeto para cada valor ENUM
    });

    // Convertir turnos a objetos planos
    const turnosPlanos = turnos.map(turno => turno.toJSON());

    // Obtener la información de los pacientes
    const pacientes = await Paciente.findAll({
      attributes: ['ID', 'usuarioID', 'obra_social', 'dato_contacto'],
      include: [
        {
          model: Usuario,
          attributes: ['ID'],
          include: [
            {
              model: Persona,
              attributes: ['nombre', 'dni'],
            },
          ],
        },
      ],
    });

    // Enviar los turnos a la vista
    res.render('listaTurnos', { turnos: turnosPlanos, tipoTurnos, pacientes });
  } catch (error) {
    console.error('Error al listar turnos:', error);
    res.status(500).send('Error al listar los turnos');
  }
};

exports.actualizarTurnos = async (req, res) => {

    try {
      // Extraemos los datos enviados desde el formulario
      const { ID, pacienteID, estado_turno } = req.body;
  
      // Verificamos que el ID del turno esté presente
      if (!ID) {
        return res.status(400).json({ message: 'El ID del turno es requerido' });
      }
  
      // Buscamos el turno en la base de datos
      const turno = await Turno.findByPk(ID);
  
      // Verificamos que el turno existe
      if (!turno) {
        return res.status(404).json({ message: 'Turno no encontrado' });
      }
  
      // Actualizamos los campos del turno según los datos enviados
      turno.pacienteID = pacienteID || null; // Si no se seleccionó paciente, asignamos null
      turno.estado_turno = estado_turno;
  
      // Guardamos los cambios en la base de datos
      await turno.save();


      res.send(`
        <script>
          window.alert('Turno actualizado correctamente!!!');
          window.location.href = '/secretario/sucursal';
        </script>
      `);
      //res.redirect('/secretario/sucursal')
    } catch (error) {
      console.error('Error al actualizar el turno:', error);
      res.status(500).json({ message: 'Error al actualizar el turno' });

  try {
    const { ID, pacienteID, estado_turno } = req.body;

    if (!ID) {
      return res.status(400).json({ message: 'El ID del turno es requerido' });

    }

    const turno = await Turno.findByPk(ID);

    if (!turno) {
      return res.status(404).json({ message: 'Turno no encontrado' });
    }

    turno.pacienteID = pacienteID || null;
    turno.estado_turno = estado_turno;

    await turno.save();

    // Enviar un script que muestre un alert y redirija
    res.send(`
      <script>
        alert('Turno actualizado correctamente.');
        window.location.href = '/secretario/sucursal';
      </script>
    `);
  } catch (error) {
    console.error('Error al actualizar el turno:', error);
    res.status(500).json({ message: 'Error al actualizar el turno' });
  }
};

exports.crearAgenda = async (req, res) => {
  const {
    profesional,
    especialidadID,
    limiteSobreturnos,
    sucursal,
    duracionTurnos,
    fechaDesde,
    fechaHasta,
    clasificacionExtra,
    dias
  } = req.body;

  try {
    const nuevaAgenda = await sequelize.transaction(async (t) => {
      const agendaCreada = await Agenda.create({
        prof_especialidadID: profesional,
        sucursalID: sucursal,
        sobre_turnos_limites: limiteSobreturnos,
        duracion_turnos: duracionTurnos,
        fecha_desde: fechaDesde,
        fecha_hasta: fechaHasta,
      }, { transaction: t });

      if (clasificacionExtra) {
        await AgendaClasificacion.create({
          agendaID: agendaCreada.ID,
          clasificacionID: clasificacionExtra
        }, { transaction: t });
      }

      return agendaCreada;
    });

    for (const dia of dias) {
      if (dia.horaInicioManiana) {
        await AgendaDia.create({
          agendaID: nuevaAgenda.ID,
          diaID: dia.diaID,
          hora_inicio: dia.horaInicioManiana,
          hora_final: dia.horaFinalManiana,
        });
      }
      if (dia.horaInicioTarde) {
        await AgendaDia.create({
          agendaID: nuevaAgenda.ID,
          diaID: dia.diaID,
          hora_inicio: dia.horaInicioTarde,
          hora_final: dia.horaFinalTarde,
        });
      }
    }

    for (const dia of dias) {
      const diaID = parseInt(dia.diaID);
      let fechaTurno = new Date(fechaDesde);
      let fechaLimite = new Date(fechaHasta);

      while (fechaTurno <= new Date(sumarUnDia(fechaHasta))) {
        if (fechaTurno.getDay() === diaID) {
          console.log('Creando turnos para:', fechaTurno.toISOString().split('T')[0]);

          if (dia.horaInicioManiana) {
            const turnosManiana = calcularTurnos(dia.horaInicioManiana, dia.horaFinalManiana, duracionTurnos);
            for (const turno of turnosManiana) {
              await Turno.create({
                agendaID: nuevaAgenda.ID,
                fecha: (fechaTurno - 1),
                hora_inicio: turno.inicio,
                hora_final: turno.fin,
                motivo: "",
                pacienteID: null,
                estado_turno: 'Libre'
              });
            }
          }

          if (dia.horaInicioTarde) {
            const turnosTarde = calcularTurnos(dia.horaInicioTarde, dia.horaFinalTarde, duracionTurnos);
            for (const turno of turnosTarde) {
              await Turno.create({
                agendaID: nuevaAgenda.ID,
                fecha: (fechaTurno - 1),
                hora_inicio: turno.inicio,
                hora_final: turno.fin,
                motivo: "",
                pacienteID: null,
                estado_turno: 'Libre'
              });
            }
          }
        }


      // Redirigir después de que se complete la creación
      res.redirect('/secretario/sucursal');
    

        fechaTurno.setDate(fechaTurno.getDate() + 1);
      }
    }


    // Enviar un script que muestre un alert y redirija
    res.send(`
      <script>
        alert('Agenda creada correctamente.');
        window.location.href = '/secretario/sucursal';
      </script>
    `);
  } catch (error) {
    console.error('Error al crear la agenda:', error);
    res.status(500).json({ message: 'Error al crear la agenda' });
  }
};

exports.listarAgendas = async(req,res) => {
  const sucursalId = req.query.sucursal;
  const fechaActual = new Date();
  console.log(`Sucursal ID: ${sucursalId}`)
  try{
    //TO DO: Modificarlo para que busque las agendas segun la variable sucursalId
    const agendas = await Agenda.findAll({
      where:{
        sucursalID:sucursalId,
        fecha_desde: {[Op.lte]:fechaActual},
        fecha_hasta: {[Op.gte]:fechaActual},
      },
      attributes: ['ID', 'sobre_turnos_limites', 'prof_especialidadID', 'sucursalID', 'duracion_turnos', 'fecha_desde', 'fecha_hasta'],
      include: [
          {
              model: ProfesionalEspecialidad,
              as: 'EspecialidadesProfesionale',
              attributes: ['ID'],
              include: [
                  {
                      model: Profesional,
                      attributes: ['ID'],
                      include: [
                          {
                              model: Persona,
                              attributes: ['nombre']
                          }
                      ]
                  },
                  {
                      model: Especialidad,
                      attributes: ['nombre']
                  }
              ]
          }
      ]
  });  
      //res.json(agendas[0].EspecialidadesProfesionale)
      res.render('listaMedicos',{agendas})      
  } catch (error) {
      console.error('Error al obtner las especialidades relacionadas a los profesionales',error)
  }
}

exports.renderCrearAgenda = async(req,res) =>{
  try{
    const profesionales = await ProfesionalEspecialidad.findAll({
      attributes: ['ID','especialidadID', 'profesionalID'],
      include: [
        {
          model: Especialidad,
          attributes: ['ID','nombre'], // Alias para el nombre de la especialidad
        },
        {
          model: Profesional,
          attributes: ['estado'],
          where:{estado:true},
          include: [
            {
              model: Persona,
              attributes: ['nombre'], // Alias para el nombre de la persona
            }
          ]
        }
      ]
    });

    const sucursales = await Sucursal.findAll({
      attributes:['ID','nombre','ciudad']
    })

    const clasificacionesExtra = await Clasificacion.findAll({
      attributes: ['ID', 'nombre'],
      where: {
        especialidad: 0
      }
    });

    const dias = await Dia.findAll({
      attributes:['ID','nombre']
    })

    //res.json(clasificacionesExtra)
    res.render('crearAgenda',{profesionales,sucursales,clasificacionesExtra,dias})
  }catch (error) {
    console.error('Error al renderizar crear agenda',error);
  }
} 

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
    res.render('SelectSucursal',{sucursales});
  } catch (error) {
    // Manejar errores
    console.error("Error al listar sucursales:", error);
    res.status(500).json({ mensaje: "Error interno del servidor." });
  }
};

exports.crearSobreturno = async (req, res) => {
  const { agendaID, fecha, hora_inicio, hora_final, pacienteID } = req.body;
  const motivo =""

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
        </script>
      `);
    }

    // Crear el sobreturno
    await Turno.create({
      agendaID,
      fecha,
      hora_inicio,
      hora_final,
      motivo,
      pacienteID,
      estado_turno: 'sobreturno',
    });

    // Descontar el límite de sobreturnos
    await Agenda.update(
      { sobre_turnos_limites: agenda.sobre_turnos_limites - 1 },
      { where: { ID: agendaID } }
    );

    // Mostrar un mensaje de éxito y cerrar la pestaña
    res.send(`
      <script>
        alert('Sobreturno creado correctamente.');
      </script>
    `);
  } catch (error) {
    console.error('Error al crear el sobreturno:', error);
    res.status(500).send('Error al crear el sobreturno');
  }
}