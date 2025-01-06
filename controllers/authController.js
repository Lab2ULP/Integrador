/*const Usuario = require('../models/usuario');
const bcrypt = require('bcryptjs');

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
      res.redirect('/secretario/lista/agendas');
    } else {
      res.redirect('/pacientes/principal');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al iniciar sesión');
  }
};*/

const Usuario = require('../models/usuario');
const bcrypt = require('bcryptjs');

exports.login = (req, res) => {
  res.render('login'); // Renderiza la vista de login
};

exports.iniciarSesion = async (req, res) => {
  const { email, password } = req.body;

  try {
      const usuario = await Usuario.findOne({ where: { email } });

      if (!usuario) {
          return res.status(404).send('Usuario no encontrado');
      }

      const passwordValido = await bcrypt.compare(password, usuario.password);

      if (!passwordValido) {
          return res.status(401).send('Contraseña incorrecta');
      }

      req.session.userId = usuario.ID;
      req.session.rol = usuario.rolID;

      if (usuario.rolID == 1) {
          res.redirect('/profesionales/lista');
      } else if (usuario.rolID == 2) {
          res.redirect('/secretario/lista/agendas');
      } else {
          res.redirect('/pacientes/principal');
      }
  } catch (error) {
      console.error(error);
      res.status(500).send('Error al iniciar sesión');
  }
};
