const e = require('express');
const { Clasificacion, Agenda, AgendaClasificacion, Profesional, Especialidad, ProfesionalEspecialidad,Persona} = require('../models/main');

exports.listarAgendas = async(req,res) => {

}

exports.listarMedicos = async(req,res) => {
    try{
        const profesionales = await ProfesionalEspecialidad.findAll({
            attributes: ['especialidadID', 'profesionalID'],
            include: [
              {
                model: Especialidad,
                attributes: ['nombre'], // Alias para el nombre de la especialidad
              },
              {
                model: Profesional,
                attributes: ['estado'],
                where:{estado:true},
                include: [
                  {
                    model: Persona,
                    attributes: ['nombre'], // Alias para el nombre de la persona
                  }
                ]
              }
            ]
          });
        
        //res.json(profesionales[0].Profesional.Persona.nombre)
        res.render('listaMedicos',{profesionales})      
    } catch (error) {
        console.error('Error al obtner las especialidades relacionadas a los profesionales',error)
    }
}