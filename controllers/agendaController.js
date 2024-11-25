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

      res.redirect('/secretario/lista/agendas')
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
      // Paso 1: Crear la agenda y la clasificación, en una transacción
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

          return agendaCreada; // Devolver la agenda creada para su uso posterior
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
        // Paso 3: Crear los turnos para cada día seleccionado
        for (const dia of dias) {
          const diaID = parseInt(dia.diaID); // Convertir diaID a número para comparar con getDay()

          let fechaTurno = new Date(fechaDesde); // Inicializar desde la fecha de inicio cada vez
          let fechaLimite = new Date(fechaHasta)
          // Iterar dentro del rango de fechas
          while (fechaTurno <= new Date(sumarUnDia(fechaHasta))) {
              // Verificar si la fecha actual corresponde al día de la semana seleccionado en el checkbox
              if (fechaTurno.getDay() === diaID) {
                  console.log('Creando turnos para:', fechaTurno.toISOString().split('T')[0]);
      
                  // Crear turnos para la mañana, si está configurada
                  if (dia.horaInicioManiana) {
                      const turnosManiana = calcularTurnos(dia.horaInicioManiana, dia.horaFinalManiana, duracionTurnos);
                      for (const turno of turnosManiana) {
                          await Turno.create({
                              agendaID: nuevaAgenda.ID,
                              fecha: (fechaTurno-1), // Guardar fecha en formato 'YYYY-MM-DD'
                              hora_inicio: turno.inicio,
                              hora_final: turno.fin,
                              motivo: "",
                              pacienteID: null,
                              estado_turno: 'Libre'
                          });
                      }
                  }
      
                  // Crear turnos para la tarde, si está configurada
                  if (dia.horaInicioTarde) {
                      const turnosTarde = calcularTurnos(dia.horaInicioTarde, dia.horaFinalTarde, duracionTurnos);
                      for (const turno of turnosTarde) {
                          await Turno.create({
                              agendaID: nuevaAgenda.ID,
                              fecha: (fechaTurno-1),
                              hora_inicio: turno.inicio,
                              hora_final: turno.fin,
                              motivo: "",
                              pacienteID: null,
                              estado_turno: 'Libre'
                          });
                      }
                  }
              }
      
              // Avanzar al siguiente día sin modificar el día original
              fechaTurno.setDate(fechaTurno.getDate() + 1);
          }
      }
      

      // Redirigir después de que se complete la creación
      res.redirect('/secretario/lista/agendas');
    

  } catch (error) {
      console.error('Error al crear la agenda:', error);
      res.status(500).json({ message: 'Error al crear la agenda' });
  }
}; 

exports.listarAgendas = async(req,res) => {
  try{

    const agendas = await Agenda.findAll({
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
