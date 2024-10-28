const Persona = require('../models/persona');
const Profesional = require('../models/profesional')

exports.crearProfesional = async(req,res)=>{
    try {
    const {nombre, dni, nacimiento} = req.body;
    await Persona.create({nombre, dni, nacimiento});
    res.redirect('/');
    } catch (error) {
    console.error(error);
    res.status(500).send('Error al crear el profesional');
    };
}

exports.obtenerProfesionalConEspecialidades = async (req, res) => {
    const profesionalID = req.params.id;
    
    try {
      const profesional = await Profesional.findOne({
        where: { id: profesionalID },
        include: [{ model: Especialidad }]
      });
  
      if (!profesional) {
        return res.status(404).send('Profesional no encontrado');
      }
  
      res.render('detallesProfesional', { profesional }); // Renderiza una vista o envía la respuesta JSON
    } catch (error) {
      console.error(error);
      res.status(500).send('Error al obtener el profesional');
    }
};

