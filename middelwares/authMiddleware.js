// /middlewares/authMiddleware.js

exports.isAuthenticated = (req, res, next) => {
    if (req.session && req.session.userId) {
      return next();
    }
    res.redirect('/'); // Redirige al login si no está autenticado
};
  
// Middleware para verificar rol de Administrador
exports.isAdmin = (req, res, next) => {
    if (req.session && req.session.rol === 1) { // 1 para Administrador
      return next();
    }
    res.status(403).send('Acceso denegado. Solo administradores pueden acceder a esta página.');
};
  
// Middleware para verificar rol de Secretario
exports.isSecretary = (req, res, next) => {
    if (req.session && req.session.rol === 2) { // 2 para Secretario
      return next();
    }
    res.status(403).send('Acceso denegado. Solo secretarios pueden acceder a esta página.');
};
  
// Middleware para verificar rol de Cliente
exports.isClient = (req, res, next) => {
    if (req.session && req.session.rol === 3) { // 3 para Cliente
      return next();
    }
    res.status(403).send('Acceso denegado. Solo clientes pueden acceder a esta página.');
};
  