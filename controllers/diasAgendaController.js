const { Agenda, Dia, ProfesionalEspecialidad } = require ('../models/main');
const AgendaDia = require ('../models/agendaDia');


exports.obtenerTodosDiasAgendas = async (req, res) => {
  try {
    // Consulta para obtener todos los registros de dias_agendas
    const diasAgendas = await AgendaDia.findAll();

    // Devuelve los registros en formato JSON
 //   res.json(diasAgendas);
    res.render('diasAgenda', { diasAgendas });
  } catch (error) {
    console.error("Error al obtener los registros de dias_agendas:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// Controlador para manejar CRUD en dias_agendas
exports.agregarDiaAgenda = async (req, res) => {
  try {
      const { agendaID, diaID, hora_inicio, hora_final } = req.body;
      
      // Validación de datos
      if (!agendaID || !diaID || !hora_inicio || !hora_final) {
          return res.status(400).json({ error: "Todos los campos son obligatorios" });
      }

      // Inserción en la base de datos usando Sequelize
      const nuevoDiaAgenda = await AgendaDia.create({
          agendaID: agendaID,
          diaID: diaID,
          hora_inicio: hora_inicio,
          hora_final: hora_final
      });

      // Retornar el nuevo registro creado
     // res.json(nuevoDiaAgenda);
      res.redirect('/diasAgenda/todos');
  } catch (error) {
      console.error("Error al agregar un registro en dias_agendas:", error);
      res.status(500).json({ error: "Error interno del servidor" });
  }
};

  
  // Función para actualizar un registro existente en dias_agendas
  exports.actualizarDiaAgenda = async (req, res) => {
    try {

      const { ID, diaID, hora_inicio, hora_final } = req.body;
  
      if (!ID) {
        console.log("No se proporcionó un ID");
        return res.status(400).json({ error: "ID no proporcionado" });
      }
  
      // Realizar la actualización en la base de datos
      await AgendaDia.update(
        {
          "diaID":diaID,
          "hora_inicio":hora_inicio,
          "hora_final":hora_final
        },
        {
          where: { ID } // Asegúrate de que este sea el ID correcto
        }
      );

         res.redirect('/diasAgenda/todos');
      
    } catch (error) {
      console.error("Error al actualizar un registro en dias_agendas:", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  };
  
  
  // Función para eliminar un registro en dias_agendas
  exports.eliminarDiaAgenda = async (req, res) => {
    try {
      const { ID } = req.body; // Asegúrate de que el ID se obtenga del cuerpo de la solicitud
  
      // Validar que ID no sea undefined
      if (!ID) {
        return res.status(400).json({ error: "ID no proporcionado" });
      }
  
      // Eliminar el registro en la base de datos
      const delDiaAgenda = await AgendaDia.destroy({
        where: {
          ID: ID // Asegúrate de que esto corresponde a la columna correcta en la base de datos
        }
      });
  
      // Comprobar si se encontró y eliminó el registro
      if (delDiaAgenda === 0) {
        console.log('Registro no encontrado para el ID:', ID);
        return res.status(404).json({ error: 'Registro no encontrado' });
      }
  
      // Responder con éxito
      res.redirect('/diasAgenda/todos');
    } catch (error) {
      console.error("Error al eliminar un registro en dias_agendas:", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  };
  
  
  