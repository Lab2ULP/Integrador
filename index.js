const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const sequelize = require('./config/database');
const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session); // Importamos la función SequelizeStore
require('dotenv').config();
const helmet = require('helmet');

// Rutas
const personaRoutes = require('./routes/personaRoutes');
const authRoutes = require('./routes/authRoutes');
const usuarioRoutes = require('./routes/usuarioRoutes');
const pacienteRoutes = require('./routes/pacienteRoutes');
const pdnlRoutes = require('./routes/pdnlRoutes');
const profesionalRoutes = require('./routes/profesionalRoutes');
const agendaRoutes = require('./routes/agendaRoutes');
const clasificacionRoutes = require('./routes/clasificacionRoutes');
const diasAgendaRoutes = require('./routes/diasAgendaRoutes');
const turnoRoutes = require('./routes/turnoRoutes');

const app = express();

// Configurar Helmet para la seguridad
app.use(helmet.contentSecurityPolicy({ useDefaults: false }));

// Configuración del middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public'))); // Servir archivos estáticos

// Configurar la sesión utilizando SequelizeStore
app.use(session({
  secret: 'bicampeones_de_america',
  store: new SequelizeStore({
    db: sequelize, // Usamos la instancia de sequelize para almacenar las sesiones en la base de datos
  }),
  resave: false, // No guarda la sesión si no ha sido modificada
  saveUninitialized: true, // Guarda las sesiones no inicializadas
  cookie: { secure: false }, // Cambiar a `true` si estás utilizando HTTPS
}));

// Configurar PUG como motor de plantillas
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views')); // Ruta a las vistas

// Rutas de la aplicación
app.use('/usuarios', usuarioRoutes);
app.use('/pacientes', pacienteRoutes);
app.use('/turnos', turnoRoutes);
app.use('/api/personas', personaRoutes);
app.use('/clasificaciones', clasificacionRoutes);
app.use('/auth', authRoutes);
app.use('/noLaborables', pdnlRoutes);
app.use('/profesionales', profesionalRoutes);
app.use('/secretario', agendaRoutes);
app.use('/diasAgenda', diasAgendaRoutes);

// Ruta de inicio
app.get('/', (req, res) => {
  res.render('login');
});

// Sincronizar la base de datos y arrancar el servidor
sequelize.sync().then(() => {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
  });
}).catch(err => {
  console.error('Error al conectar a la base de datos:', err);
});
