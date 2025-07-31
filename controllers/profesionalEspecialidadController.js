//Controlador de profesionalEspecialidad.
const sequelize = require("../config/database");
const ProfesionalEspecialidad = require("../models/profesionalEspecialidad");

// Crear una nueva relación entre Profesional y Especialidad
exports.asignarEspecialidad = async (req, res) => {
  const { profesionalID, especialidadID, matricula } = req.body;
  const t = await sequelize.createTransaction();
  try {
    await ProfesionalEspecialidad.create(
      {
        profesionalID,
        especialidadID,
        matricula,
      },
      { transaction: t }
    );
    await t.commit();
    res.status(201).send("Especialidad asignada al profesional");
  } catch (error) {
    await t.rollback();
    console.error(error);
    res.status(500).send("Error al asignar la especialidad");
  }
};

// Eliminar una relación específica entre Profesional y Especialidad
exports.eliminarEspecialidad = async (req, res) => {
  const { profesionalID, especialidadID } = req.params;
  const t = await sequelize.createTransaction();
  try {
    await ProfesionalEspecialidad.destroy(
      {
        where: { profesionalID, especialidadID },
      },
      { transaction: t }
    );
    res.send("Especialidad eliminada del profesional");
  } catch (error) {
    await t.rollback();
    console.error(error);
    res.status(500).send("Error al eliminar la especialidad");
  }
};
