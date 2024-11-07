const { Clasificacion } = require('../models/main');

exports.crearClasificacion = async(req,res) => {
    const nuevoNombre = req.body.nombre; // Obtener el nombre desde el cuerpo de la solicitud
    try {
        // Crear una nueva clasificación en la base de datos
        await Clasificacion.create({
            nombre: nuevoNombre,
            especialidad: true
        });

        // Redirigir a la lista de clasificaciones después de crear
        res.redirect('/clasificaciones/listar');
        //res.json(nuevoNombre)
    } catch (error) {
        console.error('Error al crear la clasificación:', error);
        res.status(500).json({ message: 'Error al crear la clasificación' });
    } 
}

exports.listarClasificaciones = async (req, res) => {
    try {
        const clasificaciones = await Clasificacion.findAll({
            attributes: ['ID', 'nombre']
        });

        //res.json(clasificaciones)
        res.render('listaClasificaciones', { clasificaciones });
    } catch (error) {
        console.error('Error al listar las clasificaciones:', error);
        res.status(500).json({ message: 'Error al listar las clasificaciones' });
    }
};


exports.editar = async (req, res) => {
    const id = req.params.id; // Obtener el ID de la clasificación desde los parámetros
    const nuevoNombre = req.body.nombre; // Obtener el nuevo nombre desde el cuerpo de la solicitud

    try {
        // Actualizar la clasificación en la base de datos
        const [actualizado] = await Clasificacion.update(
            { nombre: nuevoNombre },
            { where: { ID: id } }
        );

        if (actualizado) {
            // Si se actualizó correctamente, redirigir o enviar respuesta adecuada
            res.redirect('/clasificaciones/listar'); // Redirige a la lista de clasificaciones
        } else {
            res.status(404).json({ message: 'Clasificación no encontrada' });
        }
    } catch (error) {
        console.error('Error al editar la clasificación:', error);
        res.status(500).json({ message: 'Error al editar la clasificación' });
    }
};