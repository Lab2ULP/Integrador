const {Persona,Profesional,DiasNoLaborables,ProfesionalDiasNoLaborables} = require('../models/main');
//const ProfesionalDiasNoLaborables = require('../models/profesionalDiasNoLaborables')

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

exports.getAllProfesionalDiasNoLaborables = async (req, res) => {
    try {
      const noLaborablesDias = await ProfesionalDiasNoLaborables.findAll({
        attributes: ['ID', 'nombre', 'profesionalID', 'dia_no_laborablesID', 'fecha'],
        include: [
          {
            model: Profesional,
            attributes: ['ID', 'personaID'],
            include: [
              {
                model: Persona,
                attributes: ['ID', 'nombre']  // Agrega otros atributos de Persona que necesites
              }
            ]
          },
          {
            model: DiasNoLaborables,
            attributes: ['ID', 'nombre']  // Agrega otros atributos de DiasNoLaborables si son necesarios
          }
        ]
      });
  //res.json(diasNoLaborables[0].Profesional.Persona.nombre);
      res.render('profesionaldnl',{noLaborablesDias});
    } catch (error) {
      console.error('Error al obtener los días no laborables:', error);
      res.status(500).send('Error al obtener los días no laborables');
    }
  };
  