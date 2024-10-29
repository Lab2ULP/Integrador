const { Profesional, Especialidad, Persona } = require('../models'); // Asegúrate de incluir Persona


exports.getProfesionalesConEspecialidades = async (req, res) => {
    try {
        const profesionales = await Profesional.findAll({
            include: [
                {
                    model: Especialidad,
                    through: {
                        attributes: [] // Omitimos la tabla intermedia
                    },
                    attributes: ['nombre'] // Traemos solo los campos necesarios
                },
                {
                    model: Persona,
                    attributes: ['nombre'] // Traemos solo el nombre de la persona
                }
            ]
        });
        console.log("tipooooooooooooo",typeof(profesionales[0].Especialidads[0].nombre))
        res.render('listaProfesionales',{profesionales})
    } catch (error) {
        console.error('Error al obtener los profesionales con sus especialidades:', error);
        res.status(500).json({ error: 'Error al obtener los profesionales con sus especialidades' });
    }
};
