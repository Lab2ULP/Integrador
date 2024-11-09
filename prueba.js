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

// Ejemplo de uso:
const horaInicio = "08:00";
const horaFin = "10:00";
const duracionTurno = 60;

console.log(calcularTurnos(horaInicio, horaFin, duracionTurno));
