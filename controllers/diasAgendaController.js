const { Agenda, Dia, ProfesionalEspecialidad } = require ('../models/main');
const AgendaDia = require ('../models/agendaDia');

// Controlador para manejar CRUD en dias_agendas
exports.agregarDiaAgenda = async (req, res) => {
    try {
      const { agendaID, diaID, hora_inicio, hora_final } = req.body;
      
      // Validación de datos
      if (!agendaID || !diaID || !hora_inicio || !hora_final) {
        return res.status(400).json({ error: "Todos los campos son obligatorios" });
      }
  
      const nuevoDiaAgenda = await AgendaDia.create({
        agendaID,
        diaID,
        hora_inicio,
        hora_final
      });
  
      res.status(201).json(nuevoDiaAgenda);
      res.render('diasAgenda', { nuevoDiaAgenda });
    } catch (error) {
      console.error("Error al agregar un registro en dias_agendas:", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  };
  
  // Función para actualizar un registro existente en dias_agendas
  exports.actualizarDiaAgenda = async (req, res) => {
    try {
      const { id } = req.params;
      const { agendaID, diaID, hora_inicio, hora_final } = req.body;
  
      const actDiaAgenda = await AgendaDia.findByPk(id);
      if (!actDiaAgenda) {
        return res.status(404).json({ error: "Registro no encontrado" });
      }
  
      await actDiaAgenda.update({
        agendaID,
        diaID,
        hora_inicio,
        hora_final
      });
  
      res.status(200).json(actDiaAgenda);
      res.render('diasAgenda', {actDiaAgenda });
    } catch (error) {
      console.error("Error al actualizar un registro en dias_agendas:", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  };
  
  // Función para eliminar un registro en dias_agendas
  exports.eliminarDiaAgenda = async (req, res) => {
    try {
      const { id } = req.params;
  
      const delDiaAgenda = await AgendaDia.findByPk(id);
      if (!delDiaAgenda) {
        return res.status(404).json({ error: "Registro no encontrado" });
      }
  
      await delDiaAgenda.destroy();
      res.status(200).json({ message: "Registro eliminado correctamente" });
      res.render('diasAgenda', { delDiaAgenda });
    } catch (error) {
      console.error("Error al eliminar un registro en dias_agendas:", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  };