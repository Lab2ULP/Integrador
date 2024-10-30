// Importamos todos los modelos desde el archivo principal
const { Profesional, Persona, Especialidad } = require('../models/main');


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
        //res.json(profesionales)
        res.render('listaProfesionales',{profesionales})
    } catch (error) {
        console.error('Error al obtener los profesionales con sus especialidades:', error);
        res.status(500).json({ error: 'Error al obtener los profesionales con sus especialidades' });
    }
};

exports.renderEditarProfesional = async (req, res) => {
  try {
    const profesional = await Profesional.findByPk(req.params.id, {
      include: [
        Persona, // Incluye Persona sin alias
        Especialidad // Incluye Especialidad sin alias
      ]
    });

    if (!profesional) {
      return res.status(404).send('Profesional no encontrado');
    }

    if (typeof profesional.Persona.nacimiento === 'string') {
      profesional.Persona.nacimiento = new Date(profesional.Persona.nacimiento);
    }
    //console.log(profesional)
    //res.json(profesional)
    return res.render('editarProfesional', { profesional });
  } catch (error) {
    console.error(error);
    return res.status(500).send('Error al cargar el profesional para edición');
  }
};

exports.editarProfesional = async (req, res) => {
  try {
    const { id } = req.params.id;
    const { nombre, dni, nacimiento, matricula, especialidades } = req.body;

    // Encuentra el profesional junto con la persona asociada
    const profesional = await Profesional.findByPk(id, { include: [{ model: Persona, as: 'persona' }] });

    if (!profesional) {
      return res.status(404).send('Profesional no encontrado');
    }

    // Actualizar datos de Persona
    await profesional.persona.update({ nombre, dni, nacimiento });

    // Actualizar datos de Profesional (ej. matrícula)
    await profesional.update({ matricula });

    // Actualizar las especialidades del profesional
    if (especialidades && especialidades.length) {
      await profesional.setEspecialidades(especialidades);
    }

    return res.redirect('/api/profesionales');
  } catch (error) {
    console.error(error);
    return res.status(500).send('Error al actualizar el profesional');
  }
};

exports.actualizarEstado = async (req,res) => {
  const { profesionalID, estado } = req.body;

  // Aquí actualizas el estado del médico en la base de datos
  try {
    await Profesional.update(
      { estado: estado },
      { where: { ID: profesionalID } }
    );

    res.redirect('/lis/profesionales'); // Redirige a donde sea necesario
  } catch (error) {
    console.error('Error al actualizar el estado:', error);
    res.status(500).send('Error al actualizar el estado');
  }
}

exports.renderCrear = async(req,res)=>{
  try{
    const especialidades = await Especialidad.findAll({
      attributes:['ID','nombre']
    })
  res.render('crearProfesional',{ especialidades })
  } catch (error) {

  }
}