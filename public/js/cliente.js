document.addEventListener("DOMContentLoaded", () => {
  const especialidadSelect = document.getElementById("especialidad");
  const profesionalSelect = document.getElementById("profesional");
  const listaTurnos = document.getElementById("listaTurnos");

  // Evento para cargar profesionales según la especialidad seleccionada
  especialidadSelect.addEventListener("change", async function () {
    const especialidadID = this.value;

    // Limpiar select de profesionales y lista de turnos
    profesionalSelect.innerHTML = '<option value="">-- Seleccione un profesional --</option>';
    listaTurnos.innerHTML = '<li>-- Seleccione una especialidad y un profesional --</li>';
    profesionalSelect.disabled = true;

    if (!especialidadID) return;

    try {
      const response = await fetch(`/pacientes/obtenerByEspecialidad/${especialidadID}`);
      const profesionales = await response.json();

      // Popular el select de profesionales
      profesionales.forEach(profesional => {
        const option = document.createElement("option");
        option.value = profesional.id; // El ID del profesional
        option.textContent = profesional.nombre; // El nombre del profesional
        profesionalSelect.appendChild(option);
      });

      profesionalSelect.disabled = false; // Activar el select
    } catch (error) {
      console.error("Error al cargar profesionales:", error);
    }
  });

  // Evento para cargar turnos según el profesional seleccionado
  profesionalSelect.addEventListener("change", async function () {
    const profesionalID = this.value;
    const especialidadID = especialidadSelect.value;

    listaTurnos.innerHTML = '<li>-- Cargando turnos --</li>';

    if (!profesionalID || !especialidadID) {
      listaTurnos.innerHTML = '<li>-- Seleccione un profesional y una especialidad --</li>';
      return;
    }

    try {
      // Fetch para obtener turnos según especialidad y profesional
      const response = await fetch(`/pacientes/obtenerTurnos/${profesionalID}/${especialidadID}`);
      const turnos = await response.json();

      // Renderizar los turnos en la lista
      listaTurnos.innerHTML = ""; // Limpiar la lista de turnos
      if (turnos.length === 0) {
        listaTurnos.innerHTML = '<li>-- No hay turnos disponibles --</li>';
        return;
      }

      turnos.forEach(turno => {
        const li = document.createElement("li");
        li.textContent = `Fecha: ${turno.fecha}, Hora: ${turno.hora_inicio} - ${turno.hora_final}, Estado: ${turno.estado}, Paciente: ${turno.paciente}`;
        listaTurnos.appendChild(li);
      });
    } catch (error) {
      console.error("Error al cargar turnos:", error);
      listaTurnos.innerHTML = '<li>-- Error al cargar turnos --</li>';
    }
  });
});
