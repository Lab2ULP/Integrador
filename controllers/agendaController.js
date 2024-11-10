// Función que itera sobre el rango de fechas y crea los turnos
const { Clasificacion, AgendaDia, Agenda, AgendaClasificacion, Profesional, Especialidad, ProfesionalEspecialidad, Persona, Sucursal, Dia, Turno, Paciente } = require('../models/main');
const { calcularTurnos, sumarUnDia } = require('../utils/funciones');
const sequelize = require('../config/database');


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
        // Ejecutar la transacción principal
        const nuevaAgenda = await sequelize.transaction(async (t) => {
            // Crear la agenda
            const nuevaAgenda = await Agenda.create({
                prof_especialidadID: profesional,
                sucursalID: sucursal,
                sobre_turnos_limites: limiteSobreturnos,
                duracion_turnos: duracionTurnos,
                fecha_desde: fechaDesde,
                fecha_hasta: fechaHasta,
            }, { transaction: t });

            // Crear AgendaClasificacion si hay clasificacion extra
            if (clasificacionExtra) {
                await AgendaClasificacion.create({
                    agendaID: nuevaAgenda.ID,
                    clasificacionID: clasificacionExtra
                }, { transaction: t });
            }

            // Crear AgendaDia para cada día
            for (const dia of dias) {
                if (dia.horaInicioManiana) {
                    await AgendaDia.create({
                        agendaID: nuevaAgenda.ID,
                        diaID: dia.diaID,
                        hora_inicio: dia.horaInicioManiana,
                        hora_final: dia.horaFinalManiana,
                    }, { transaction: t });
                }
                if (dia.horaInicioTarde) {
                    await AgendaDia.create({
                        agendaID: nuevaAgenda.ID,
                        diaID: dia.diaID,
                        hora_inicio: dia.horaInicioTarde,
                        hora_final: dia.horaFinalTarde,
                    }, { transaction: t });
                }
            }

            return nuevaAgenda; // Devolver la nueva agenda para usar su ID
        });

        // Crear los turnos fuera de la transacción principal
        let fechaTurno = new Date(fechaDesde); // Convertimos la fechaDesde a un objeto Date para iterar sobre ella.

        while (fechaTurno <= new Date(fechaHasta)) { // Mientras la fechaTurno esté dentro del rango
            for (const dia of dias) {
                // Crear turnos solo para los días seleccionados y horas correspondientes
                if (dia.diaID) {
                    if (dia.horaInicioManiana) {
                        const turnosManiana = calcularTurnos(dia.horaInicioManiana, dia.horaFinalManiana, duracionTurnos);
                        for (let i = 0; i < turnosManiana.length; i++) {
                            const turno = turnosManiana[i];
                            // Crear turno solo si está dentro de las fechas seleccionadas
                            if (fechaTurno >= new Date(fechaDesde) && fechaTurno <= new Date(fechaHasta)) {
                                await Turno.create({
                                    agendaID: nuevaAgenda.ID,
                                    fecha: fechaTurno.toISOString().split('T')[0], // Guardamos la fecha en formato 'YYYY-MM-DD'
                                    hora_inicio: turno.inicio,
                                    hora_final: turno.fin,
                                    motivo: "",
                                    pacienteID: null,
                                    estado_turno: 'Libre'
                                });
                            }
                        }
                    }

                    // Repetir para la tarde
                    if (dia.horaInicioTarde) {
                        const turnosTarde = calcularTurnos(dia.horaInicioTarde, dia.horaFinalTarde, duracionTurnos);
                        for (let i = 0; i < turnosTarde.length; i++) {
                            const turno = turnosTarde[i];
                            if (fechaTurno >= new Date(fechaDesde) && fechaTurno <= new Date(fechaHasta)) {
                                await Turno.create({
                                    agendaID: nuevaAgenda.ID,
                                    fecha: fechaTurno.toISOString().split('T')[0], // Guardamos la fecha en formato 'YYYY-MM-DD'
                                    hora_inicio: turno.inicio,
                                    hora_final: turno.fin,
                                    motivo: "",
                                    pacienteID: null,
                                    estado_turno: 'Libre'
                                });
                            }
                        }
                    }
                }
            }

            // Sumar un día a la fechaTurno
            fechaTurno = sumarUnDia(fechaTurno); // Avanzar al siguiente día
        }

        res.redirect('/secretario/lista/medicos');
    } catch (error) {
        console.error('Error al crear la agenda:', error);
        res.status(500).json({ message: 'Error al crear la agenda' });
    }
};






/*
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
      // Ejecutar la transacción principal
      const nuevaAgenda = await sequelize.transaction(async (t) => {
          // Crear la agenda
          const nuevaAgenda = await Agenda.create({
              prof_especialidadID: profesional,
              sucursalID: sucursal,
              sobre_turnos_limites: limiteSobreturnos,
              duracion_turnos: duracionTurnos,
              fecha_desde: fechaDesde,
              fecha_hasta: fechaHasta,
          }, { transaction: t });

          // Crear AgendaClasificacion si hay clasificacion extra
          if (clasificacionExtra) {
              await AgendaClasificacion.create({
                  agendaID: nuevaAgenda.ID,
                  clasificacionID: clasificacionExtra
              }, { transaction: t });
          }

          // Crear AgendaDia para cada día
          for (const dia of dias) {
              if (dia.horaInicioManiana) {
                  await AgendaDia.create({
                      agendaID: nuevaAgenda.ID,
                      diaID: dia.diaID,
                      hora_inicio: dia.horaInicioManiana,
                      hora_final: dia.horaFinalManiana,
                  }, { transaction: t });
              }
              if (dia.horaInicioTarde) {
                  await AgendaDia.create({
                      agendaID: nuevaAgenda.ID,
                      diaID: dia.diaID,
                      hora_inicio: dia.horaInicioTarde,
                      hora_final: dia.horaFinalTarde,
                  }, { transaction: t });
              }
          }

          return nuevaAgenda; // Devolver la nueva agenda para usar su ID
      });

      // Crear los turnos fuera de la transacción principal
      for (const dia of dias) {
        if(dia.diaID){
          let fechaTurno = fechaDesde;  // Mantén la fecha desde para la primera iteración.
          if (dia.horaInicioManiana) {
              const cantidadTurnos = calcularTurnos(dia.horaInicioManiana, dia.horaFinalManiana, duracionTurnos);
              for (let i = 0; i < cantidadTurnos.length; i++) {
                  const turno = cantidadTurnos[i];
                  await Turno.create({
                      agendaID: nuevaAgenda.ID,
                      fecha: fechaTurno,
                      hora_inicio: turno.inicio,
                      hora_final: turno.fin,
                      motivo: "",
                      pacienteID: null,
                      estado_turno: 'Libre'
                  });

                  // Sumar un día solo después del primer turno.
                  if (i < cantidadTurnos.length - 1) {
                      fechaTurno = sumarUnDia(fechaTurno);
                  }
              }
          }

          // Repite lo mismo para la tarde, si aplica
          if (dia.horaInicioTarde) {
              const cantidadTurnos = calcularTurnos(dia.horaInicioTarde, dia.horaFinalTarde, duracionTurnos);
              fechaTurno = fechaDesde;  // Reiniciar la fecha para la tarde
              for (let i = 0; i < cantidadTurnos.length; i++) {
                  const turno = cantidadTurnos[i];
                  await Turno.create({
                      agendaID: nuevaAgenda.ID,
                      fecha: fechaTurno,
                      hora_inicio: turno.inicio,
                      hora_final: turno.fin,
                      motivo: "",
                      pacienteID: null,
                      estado_turno: 'Libre'
                  });

                  // Sumar un día solo después del primer turno de la tarde.
                  if (i < cantidadTurnos.length - 1) {
                      fechaTurno = sumarUnDia(fechaTurno);
                  }
              }
          }
        }
      }
      res.redirect('/secretario/lista/medicos');
  } catch (error) {
      console.error('Error al crear la agenda:', error);
      res.status(500).json({ message: 'Error al crear la agenda' });
  }
};*/



exports.listarAgendas = async(req,res) => {

}

exports.listarMedicos = async(req,res) => {
    try{
        const profesionales = await ProfesionalEspecialidad.findAll({
            attributes: ['especialidadID', 'profesionalID'],
            include: [
              {
                model: Especialidad,
                attributes: ['nombre'], // Alias para el nombre de la especialidad
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
        
        //res.json(profesionales[0].Profesional.Persona.nombre)
        res.render('listaMedicos',{profesionales})      
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



/*
exports.crearAgenda= async(req,res) => {
  const {
    profesional,
    especialidadID,
    limiteSobreturnos,
    sucursal,
    duracionTurnos,
    fechaDesde,
    fechaHasta,
    clasificacionExtra,
    dias // Este campo debe ser un array de días con sus horarios
} = req.body;
for (const dia of dias) {
  if(dia.diaID){
    console.log('Hay dia' + dia.nombre)
  }else{
    console.log('NO Hay dia' + dia.nombre) 
  }
}
res.json(dias)
}
*/
/*
              await AgendaDia.create({
                agendaID: nuevaAgenda.ID,
                diaID: dia.diaID,
                hora_inicio_maniana: dia.horaInicioManiana,
                hora_fin_maniana: dia.horaFinalManiana,
                hora_inicio_tarde: dia.horaInicioTarde,
                hora_fin_tarde: dia.horaFinalTarde,
              }, { transaction: t });
*/