const {Persona,Profesional,DiasNoLaborables,ProfesionalDiasNoLaborables,Especialidad} = require('../models/main');
const ProfesionalEspecialidad = require('../models/profesionalEspecialidad')
//const ProfesionalDiasNoLaborables = require('../models/profesionalDiasNoLaborables')


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

    const especialidades = await Especialidad.findAll({
      attributes:['ID','nombre']
    })

    //console.log(profesional)
    //res.json(profesional)
    return res.render('editarProfesional', { profesional, especialidades });
  } catch (error) {
    console.error(error);
    return res.status(500).send('Error al cargar el profesional para edición');
  }
};

exports.editarProfesional = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, dni, nacimiento } = req.body;

    // Encuentra el profesional junto con la persona asociada
    const profesional = await Profesional.findByPk(id, { include: [{ model: Persona }] });

    if (!profesional) {
      return res.status(404).send('Profesional no encontrado');
    }

    // Actualizar datos de Persona
    await profesional.Persona.update({ nombre, dni, nacimiento });

    return res.redirect('/lis/profesionales');
  } catch (error) {
    console.error('Error al actualizar el profesional:', error);
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

exports.crearProfesional = async (req,res) => {
  const { nombre, dni, nacimiento, especialidad, matricula }   = req.body;

  try {
    const nuevaPersona = await Persona.create({
      nombre,dni,nacimiento
    });
    const nuevoProfesional= await Profesional.create({
      personaID:nuevaPersona.ID
    });

    await ProfesionalEspecialidad.create({
      profesionalID: nuevoProfesional.ID,
      especialidadID: especialidad,matricula
    })

    res.redirect('/lis/profesionales')
  } catch (error) {
    console.error('Error al crear el profesional',error)
    res.status(500).send('Error al crear el profesional');

    };
}

exports.getAllProfesionalDiasNoLaborables = async (req, res) => {
    try {
      const noLaborablesDias = await ProfesionalDiasNoLaborables.findAll({
        attributes: ['ID', 'nombre', 'profesionalID', 'dia_no_laborablesID', 'fecha'],
        include: [
          {
            model: Profesional,
            attributes: ['ID', 'personaID'],
            include: [
              {
                model: Persona,
                attributes: ['ID', 'nombre']  // Agrega otros atributos de Persona que necesites
              }
            ]
          },
          {
            model: DiasNoLaborables,
            attributes: ['ID', 'nombre']  // Agrega otros atributos de DiasNoLaborables si son necesarios
          }
        ]
      });
  //res.json(diasNoLaborables[0].Profesional.Persona.nombre);
      res.render('profesionaldnl',{noLaborablesDias});
    } catch (error) {
      console.error('Error al obtener los días no laborables:', error);
      res.status(500).send('Error al obtener los días no laborables');
    }
  };
  

  }
}

exports.sumarEspecialidad = async (req, res) => {
  const { especialidad, matricula } = req.body;
  const profesionalID = req.params.id; // Asegúrate de que este id es correcto
  try {
    // Cambiar los nombres de las propiedades para que coincidan con los nombres de las columnas de la tabla intermedia
    await ProfesionalEspecialidad.create({
      especialidadID: especialidad, // Asegúrate de que esto sea el ID de la especialidad
      profesionalID: profesionalID, // Esto es correcto
      matricula: matricula // Esto es correcto
    });
    //window.alert('')
    res.redirect(`/lis/edit/${profesionalID}`);
  } catch (error) {
    console.error('Error al añadir especialidad', error);
    res.status(500).send('Error al añadir especialidad'); // Respuesta de error adecuada
  }
};

exports.borrarEspecialidad = async (req, res) => {
  const { profesionalID, especialidadID } = req.body;

  try {
    // Busca y elimina la relación donde coincidan ambos IDs
    await ProfesionalEspecialidad.destroy({
      where: {
        profesionalID: profesionalID,
        especialidadID: especialidadID
      }
    });

    res.redirect(`/lis/edit/${profesionalID}`);
  } catch (error) {
    console.error('Error al eliminar la especialidad del profesional:', error);
    res.status(500).send('Error al eliminar la especialidad del profesional');
  }
};

