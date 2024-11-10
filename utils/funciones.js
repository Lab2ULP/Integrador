function calcularTurnos(horaInicio, horaFinal, duracion) {
    const turnos = [];
    
    // Crear las fechas de inicio y fin usando las horas proporcionadas
    let horaInicioDate = new Date(`1970-01-01T${horaInicio}:00`); // Usar solo horaInicio como base
    const horaFinalDate = new Date(`1970-01-01T${horaFinal}:00`); // Usar solo horaFinal como base
  
    while (horaInicioDate < horaFinalDate) {
        const horaFin = new Date(horaInicioDate.getTime() + duracion * 60000); // duracion en minutos
        
        // Convertir la hora de inicio y fin a formato de 24 horas sin la zona horaria
        turnos.push({
            inicio: horaInicioDate.toLocaleString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false }), // Formato 24h
            fin: horaFin.toLocaleString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false }) // Formato 24h
        });
        
        // Sumar la duración de cada turno a la hora de inicio
        horaInicioDate = horaFin;
    }
  
    return turnos;
}

function sumarUnDia(fecha) {
    const nuevaFecha = new Date(fecha);
    nuevaFecha.setDate(nuevaFecha.getDate() + 1); // Suma un día
    return nuevaFecha.toISOString().split('T')[0]; // Devuelve la fecha en formato 'YYYY-MM-DD'
} 

/*
function sumarUnDia(fechaString) {
    // Crear el objeto Date dividiendo el string en año, mes y día para evitar problemas de zona horaria
    const [anio, mes, dia] = fechaString.split('-').map(Number);
    const fecha = new Date(anio, mes - 1, dia); // Mes empieza desde 0 en Date

    // Sumar un día
    fecha.setDate(fecha.getDate() + 1);

    // Formatear la fecha de vuelta a "YYYY-MM-DD"
    const nuevoAnio = fecha.getFullYear();
    const nuevoMes = String(fecha.getMonth() + 1).padStart(2, '0');
    const nuevoDia = String(fecha.getDate()).padStart(2, '0');

    return `${nuevoAnio}-${nuevoMes}-${nuevoDia}`;
}*/
  
// Ejemplo de uso:
/*const fechaOriginal = "2024-12-31";
const fechaConUnDiaMas = sumarUnDia(fechaOriginal);

console.log(fechaConUnDiaMas); // Debería mostrar: "2024-11-10"
*/

// Ejemplo de uso:
/*const horaInicio = "07:00";
const horaFin = "12:00";
const duracionTurno = 30;

console.log(calcularTurnos(horaInicio, horaFin, duracionTurno));
*/

module.exports = {calcularTurnos,sumarUnDia}