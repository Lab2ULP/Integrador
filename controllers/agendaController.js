// Función que itera sobre el rango de fechas y crea los turnos
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
    const turnos = await Turno.findAll({
      where: {
        fecha: { [Op.notIn]: fechasNoLaborables.length > 0 ? fechasNoLaborables : [''] },
        agendaID: agendaID
      },
      attributes: ['ID', 'agendaID', 'fecha', 'hora_inicio', 'hora_final', 'motivo', 'pacienteID', 'estado_turno'] // Seleccionar solo los campos necesarios
    });

    const tipoTurnos = Turno.rawAttributes.estado_turno.values.map(value => {
      return { nombre: value }; // Generar un objeto para cada valor ENUM
    });
    // Convertir turnos a objetos planos
    const turnosPlanos = turnos.map(turno => turno.toJSON());
    const pacientes = await Paciente.findAll({
      attributes: ['ID', 'usuarioID', 'obra_social', 'dato_contacto'],
      include: [
          {
              model: Usuario,
              attributes: ['ID'],
              include: [
                  {
                      model: Persona,
                      attributes: ['nombre','dni'],
                    
                  },
              ]
          }
      ]
  });  
    
  //res.json(pacientes);
    // Enviar los turnos a la vista
    //res.json(tipoTurnos);
    res.render('listaTurnos', { turnos: turnosPlanos, tipoTurnos, pacientes });
  } catch (error) {
    console.error('Error al listar turnos:', error);
    res.status(500).send('Error al listar los turnos');
  }
};

exports.actualizarTurnos = async (req,res) => {
    const { pacienteID, estado_turno } = req.body; // Obtener los valores del cuerpo de la solicitud
    const { ID } = req.params; // Obtener el valor del ID desde los parámetros de la URL
  
    try {
      // Crear el objeto de campos que se van a actualizar
      const updateFields = {};
  
      // Solo agregar los valores si están definidos
      if (pacienteID) {
        updateFields.pacienteID = pacienteID;
      }
      if (estado_turno) {
        updateFields.estado_turno = estado_turno;
      }
  
      // Actualizar el turno en la base de datos
      const [updated] = await Turno.update(updateFields, {
        where: { ID:ID } // Usamos el ID del turno que viene desde los parámetros
      });
  
      if (updated) {
        // Si el turno fue actualizado, redirigimos o mostramos un mensaje de éxito
        //res.redirect(`/secretario/agenda/${ID}`);
        res.json(updated)
      } else {
        // Si no se actualizó nada, enviar un mensaje de error
        res.status(400).send('No se pudo actualizar el turno');
      }
    } catch (error) {
      console.error('Error al actualizar el turno:', error);
      res.status(500).send('Error al actualizar el turno');
    }
  };
  




/*
exports.listarTurnos = async (req, res) => {
  const agendaID = req.params.ID;  // Obtener el ID de la agenda desde la URL
  const profesionalID = req.params.Pid;  // Obtener el ID del profesional desde la URL
  
  try {
    // Obtener los días no laborables para el profesional
    const diasNoLaborables = await ProfesionalDiasNoLaborables.findAll({
      attributes: ['fecha'],
      where: { profesionalID: profesionalID }
    });

    const fechasNoLaborables = diasNoLaborables.map(dia => dia.fecha);

    // Verifica si fechasNoLaborables está vacío
    if (fechasNoLaborables.length === 0) {
      console.log('No hay días no laborables');
    }

    // Obtener los turnos que no caen en días no laborables
    const turnos = await Turno.findAll({
      where: {
        fecha: { [Op.notIn]: fechasNoLaborables.length > 0 ? fechasNoLaborables : [''] },  // Si está vacío, pasa un arreglo vacío para no filtrar
        agendaID: agendaID
      }
    });

    // Agrupar los turnos por fecha
    const turnosAgrupados = turnos.reduce((acc, turno) => {
      const fecha = turno.fecha;
      if (!acc[fecha]) {
        acc[fecha] = [];
      }
      acc[fecha].push(turno);
      return acc;
    }, {});

    // Renderizar los turnos agrupados en la vista 'listaTurnos'
    res.render('listaTurnos', { turnosAgrupados });
    //res.json(turnosAgrupados)
  } catch (error) {
    console.error('Error al listar turnos:', error);
    res.status(500).send('Error al listar los turnos');
  }
};*/


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

        // Paso 2: Registrar los días seleccionados en la base de datos
        // Registrar cada día y sus horarios en la tabla "dias_agendas"
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

/*
exports.crearAgenda = async (req,res) =>{
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
res.json(sumarUnDia(fechaHasta));
}*/

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


