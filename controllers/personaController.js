// /controllers/personaController.js
const Persona = require('../models/persona'); // Asegúrate de que la ruta sea correcta


// /listar personas
exports.renderListaPersonas = async (req, res) => {
  try {
    const personas = await Persona.findAll();
 id   
    // Convertir nacimiento de string a Date
    personas.forEach(persona => {
      if (typeof persona.nacimiento === 'string') {
        persona.nacimiento = new Date(persona.nacimiento);
      }
    });

    return res.render('listarPersonas', { personas });
  } catch (error) {
    console.error(error);
    return res.status(500).send('Error al obtener las personas');
  }
};
 
// Renderizar la vista de crear persona
exports.renderCrearPersona = (req, res) => {
  res.render('crearPersona');
};

// Renderizar la vista de editar persona
exports.renderEditarPersona = async (req, res) => {
  try {
    const persona = await Persona.findByPk(req.params.ID);

    // Convertir nacimiento a Date si es una cadena
    if (typeof persona.nacimiento === 'string') {
      persona.nacimiento = new Date(persona.nacimiento);
    }

    return res.render('editarPersona', { persona });
  } catch (error) {
    console.error(error);
    return res.status(500).send('Error al cargar la persona para edición');
  }
};

// /controllers/personaController.js
exports.editarPersona = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, dni, nacimiento } = req.body;

    // Actualizar la persona en la base de datos
    await Persona.update(
      { nombre, dni, nacimiento },
      { where: { id } }
    );

    return res.redirect('/api/personas'); // Redirige a la lista después de actualizar
  } catch (error) {
    console.error(error);
    return res.status(500).send('Error al actualizar la persona');
  }
};



// Renderizar la vista de confirmar borrado
exports.renderBorrarPersona = async (req, res) => {
  try {
    const persona = await Persona.findByPk(req.params.id);
    if (!persona) {
      return res.status(404).send('Persona no encontrada');
    }
    return res.render('borrarPersona', { persona });
  } catch (error) {
    console.error(error);
    return res.status(500).send('Error al obtener la persona');
  }
};

// Crear una nueva persona
exports.createPersona = async (req, res) => {
  try {
    const { nombre, dni, nacimiento } = req.body;
    const nuevaPersona = await Persona.create({ nombre, dni, nacimiento });
    res.redirect('/api/personas'); // Redirige a la lista de personas
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al crear la persona');
  }
};

// Actualizar una persona existente
exports.updatePersona = async (req, res) => {
  try {
    const { nombre, dni, nacimiento } = req.body;
    await Persona.update({ nombre, dni, nacimiento }, {
      where: { ID: req.params.id },
    });
    res.redirect('/api/personas'); // Redirige a la lista de personas
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al actualizar la persona');
  }
};

// Eliminar una persona
exports.deletePersona = async (req, res) => {
  try {
    await Persona.destroy({
      where: { ID: req.params.id },
    });
    res.redirect('/api/personas/'); // Redirige a la lista de personas
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al eliminar la persona');
  }
};
