const {Persona,Profesional} = require('../models/main');

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