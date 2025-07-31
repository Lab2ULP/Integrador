const { Sequelize } = require("sequelize");
const Persona = require("../models/persona");
const Usuario = require("../models/usuario");

exports.crearUsuario = async (req, res) => {
  const { nombre, dni, nacimiento, email, password } = req.body;
  const t = Sequelize.createTransaction();
  try {
    // Crear la persona primero
    const nuevaPersona = await Persona.create(
      { nombre, dni, nacimiento },
      { transaction: t }
    );

    // Crear el usuario con rol de Cliente, usando el personaID de la persona creada
    await Usuario.create(
      {
        personaID: nuevaPersona.ID,
        email,
        password,
        rolID: 3, // Asumimos que el rol de 'Cliente' tiene ID 3
      },
      { transaction: t }
    );

    await t.commit();

    // Redirige al usuario al inicio o a la página que prefieras
    res.send(`
      <script>
        alert('Usuario creado con exito.');
        window.location.href = '/'; 
      </script>
    `);
  } catch (error) {
    await t.rollback();
    console.error(error);
    res.status(500).send("Error al crear el Usuario");
  }
};
