const Persona = require('../models/persona');
const Usuario = require('../models/usuario');
const Paciente = require('../models/paciente');

exports.crearPaciente = async (req, res) => {
  const { nombre, dni, nacimiento, email, password, obra_social, dato_contacto } = req.body;

  try {
    // Crear la persona primero
    const nuevaPersona = await Persona.create({ nombre, dni, nacimiento });

    // Crear el usuario con rol de Cliente, usando el personaID de la persona creada
    const nuevoUsuario = await Usuario.create({
      personaID: nuevaPersona.ID,
      email,
      password,
      rolID: 3 // Asumimos que el rol de 'Usuario' tiene ID 3
    });

    nuevoPaciente = Paciente.create({
        usuarioID: nuevoUsuario.ID,
        obra_social,
        dato_contacto
    });

    
    res.redirect('/'); // Redirige al usuario al inicio o a la página que prefieras
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al crear el cliente');
  }
};