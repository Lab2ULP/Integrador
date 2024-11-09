function calcularTurnos(horaInicio, horaFin, duracionTurno) {
    const [inicioHoras, inicioMinutos] = horaInicio.split(":").map(Number);
    const [finHoras, finMinutos] = horaFin.split(":").map(Number);

    const minutosInicio = inicioHoras * 60 + inicioMinutos;
    const minutosFin = finHoras * 60 + finMinutos;

    const minutosDiferencia = minutosFin - minutosInicio;
    const cantidadTurnos = Math.floor(minutosDiferencia / duracionTurno);

    const turnos = [];

    // Calcula y almacena el inicio y fin de cada turno
    for (let i = 0; i < cantidadTurnos; i++) {
        const inicioTurno = minutosInicio + i * duracionTurno;
        const finTurno = inicioTurno + duracionTurno;

        // Convierte los minutos en formato HH:MM
        const inicioHora = new Date(0, 0, 0, Math.floor(inicioTurno / 60), inicioTurno % 60)
            .toTimeString()
            .slice(0, 5);
        const finHora = new Date(0, 0, 0, Math.floor(finTurno / 60), finTurno % 60)
            .toTimeString()
            .slice(0, 5);

        turnos.push({ inicio: inicioHora, fin: finHora });
    }

    return turnos;
}

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
}

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