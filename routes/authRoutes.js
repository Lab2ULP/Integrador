const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');  // Verifica que el path sea correcto

// Ruta para mostrar el formulario de login
router.get('/login', authController.login);

// Ruta para procesar el inicio de sesión
router.post('/login', authController.iniciarSesion);

router.post('/logout', (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).send('Error al cerrar sesión');
      }
      res.redirect('/'); // Redirige al login o a la página de inicio
    });
});
  

module.exports = router;
