// index.js
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path'); // Para servir archivos estáticos
const personaRoutes = require('./routes/personaRoutes');
const sequelize = require('./config/database'); // Asegúrate de que la ruta a tu archivo de configuración de la base de datos sea correcta

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json()); // Para parsear el cuerpo de las solicitudes JSON
app.use(bodyParser.urlencoded({ extended: true })); // Para parsear formularios URL-encoded

// Configurar PUG como motor de plantillas
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views')); // Ruta a la carpeta de vistas

// Servir archivos estáticos (CSS, imágenes, etc.)
app.use(express.static(path.join(__dirname, 'public'))); // Asegúrate de tener una carpeta public para tus estilos

// Rutas
app.use('/api/personas', personaRoutes); // Todas las rutas de personas se agrupan bajo /api/personas

app.get('/',(req,res)=>{
  res.render('login')
})

app.get('/register',(req,res)=>{
  res.render('register')
})

// Sincronizar la base de datos y iniciar el servidor
sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
  });
}).catch(err => {
  console.error('Error al conectar a la base de datos:', err);
});