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
    // Buscar el usuario por email
    const usuario = await Usuario.findOne({ where: { email } });

    if (!usuario) {
      return res.send(`
        <script>
          alert('Usuario no encontrado.');
          window.location.href = '/';
        </script>
      `);
    }

    // Verificar la contraseña
    const passwordValido = await bcrypt.compare(password, usuario.password);

    if (!passwordValido) {
      return res.send(`
        <script>
          alert('Contraseña incorrecta.');
          window.location.href = '/';
        </script>
      `);
    }

    // Establecer la sesión
    req.session.userId = usuario.ID;
    req.session.rol = usuario.rolID;

    // Redirigir según el rol del usuario
    if (usuario.rolID == 1) {
      return res.redirect('/profesionales/lista');
    } else if (usuario.rolID == 2) {
      return res.redirect('/secretario/sucursal');
    } else {
      return res.redirect('/pacientes/sucursal');
    }
  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    return res.send(`
      <script>
        alert('Error al iniciar sesión.');
        window.location.href = '/';
      </script>
    `);
  }
};
