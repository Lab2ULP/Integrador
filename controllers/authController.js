const Usuario = require('../models/usuario');
const bcrypt = require('bcrypt');

exports.iniciarSesion = async (req, res) => {
  const { email, password } = req.body;

  try {
    const usuario = await Usuario.findOne({ where: { email } });

    if (!usuario) {
      return res.status(404).send('Usuario no encontrado');
    }

    // Imprimir información para depuración
    console.log("Contraseña ingresada:", password);
    console.log("Contraseña encriptada:", usuario.password);

    // Comparar la contraseña
    const passwordValido = await bcrypt.compare(password, usuario.password);
    console.log("¿Son iguales?", passwordValido);

    if (!passwordValido) {
      return res.status(401).send('Contraseña incorrecta');
    }

    // Crear sesión
    req.session.userId = usuario.ID;
    req.session.rol = usuario.rolID;
    
    // Renderizar vistas según el rol
    if (usuario.ID === 1) {
      res.render('adminPincipal');
    } else if (usuario.ID === 2) {
      res.render('secretarioPrincipal');
    } else {
      res.render('clientePrincipal');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al iniciar sesión');
  }
};
