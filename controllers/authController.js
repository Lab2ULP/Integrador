const Usuario = require('../models/usuario');
const bcrypt = require('bcrypt');

exports.iniciarSesion = async (req, res) => {
  const { email, password } = req.body;

  try {
    const usuario = await Usuario.findOne({ where: { email } });

    if (!usuario) {
      return res.status(404).send('Usuario no encontrado');
    }

    // Comparar la contraseña
    const passwordValido = await bcrypt.compare(password, usuario.password);

    if (!passwordValido) {
      return res.status(401).send('Contraseña incorrecta');
    }

    // Crear sesión
    req.session.userId = usuario.ID;
    req.session.rol = usuario.rolID;

    // Renderizar vistas según el rol

    if (usuario.rolID == 1) {
      res.redirect('/profesionales/lista');
    } else if (usuario.rolID == 2) {
      res.redirect('/secretario/lista/medicos');
    } else {
      res.render('usuarioPrincipal');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al iniciar sesión');
  }
};
