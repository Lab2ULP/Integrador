const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const sequelize = require('./config/database');
const session = require('express-session');
require('dotenv').config();
const helmet = require('helmet');

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

// Inicialización de la aplicación
const app = express();

// Configurar el uso de Helmet para la política de seguridad de contenido
app.use(helmet.contentSecurityPolicy({ useDefaults: false }));

// Middleware para parsear el cuerpo de las solicitudes
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Configuración para servir archivos estáticos (CSS, imágenes, etc.)
app.use(express.static(path.join(__dirname, 'public')));

// Configuración de la sesión
app.use(session({
  secret: 'bicampeones_de_america',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } 
}));

// Configuración del motor de plantillas PUG
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

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

// Ruta principal
app.get('/', (req, res) => {
  res.render('login');
});

// Sincronizar la base de datos y luego iniciar el servidor
sequelize.sync().then(() => {
  const PORT = 3306; // Asegúrate de usar el puerto correcto en Render
  app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
  });
}).catch(err => {
  console.error('Error al conectar a la base de datos:', err);
});
