module.exports = (rolesPermitidos) => {
    return (req, res, next) => {
        console.log('Sesión actual:', req.session); // Verifica si la sesión está siendo cargada correctamente

        if (!req.session.userId) {
            console.log('No autenticado, redirigiendo a login...');
            return res.send(`
                <script>
                  window.alert('Tenes que iniciar sesion para acceder a esta pagina! Seras redirigido a nuestro LogIn');
                  window.location.href = '/auth/login';
                </script>
              `);
            //return res.redirect('/auth/login');
        }

        if (!rolesPermitidos.includes(req.session.rol)) {
            console.log('Acceso denegado para este rol');
            return res.status(403).send('Acceso denegado');
        }

        // Si todo está bien, pasamos a la siguiente función
        next();
    };
};
