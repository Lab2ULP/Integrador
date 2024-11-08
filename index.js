// index.js
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path'); // Para servir archivos estáticos
const sequelize = require('./config/database'); // Asegúrate de que la ruta a tu archivo de configuración de la base de datos sea correcta
const session = require('express-session')

const personaRoutes = require('./routes/personaRoutes');
const authRoutes = require('./routes/authRoutes');
const usuarioRoutes = require('./routes/usuarioRoutes');
const pacienteRoutes = require('./routes/pacienteRoutes');
const pdnlRoutes = require('./routes/pdnlRoutes');
const profesionalRoutes = require('./routes/profesionalRoutes');
const agendaRoutes = require('./routes/agendaRoutes')
const clasificacionRoutes = require('./routes/clasificacionRoutes')
const diasAgendaRoutes = require('./routes/diasAgendaRoutes');
const turnoRoutes = require('./routes/turnoRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json()); // Para parsear el cuerpo de las solicitudes JSON
app.use(bodyParser.urlencoded({ extended: true })); // Para parsear formularios URL-encoded

// Servir archivos estáticos (CSS, imágenes, etc.)
app.use(express.static(path.join(__dirname, 'public'))); // Asegúrate de tener una carpeta public para tus estilos


//configuracion de la sesion
app.use(session({
  secret:'bicampeones_de_america',
  resave:false,
  saveUninitialized:true,
  cookie: { secure: false } 
}))

// Configurar PUG como motor de plantillas
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views')); // Ruta a la carpeta de vistas


app.use('/usuarios', usuarioRoutes);

app.use('/pacientes',pacienteRoutes);

app.use('/turnos', turnoRoutes);
// Rutas
app.use('/api/personas', personaRoutes); // Todas las rutas de personas se agrupan bajo /api/personas

app.get('/',(req,res)=>{
  res.render('login')
})

app.use('/clasificaciones',clasificacionRoutes);

app.use('/auth',authRoutes);

app.use('/noLaborables', pdnlRoutes);

app.use('/profesionales', profesionalRoutes);


app.use('/secretario', agendaRoutes)

app.use('/diasAgenda', diasAgendaRoutes);

// Sincronizar la base de datos y iniciar el servidor
sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
  });
}).catch(err => {
  console.error('Error al conectar a la base de datos:', err);
});