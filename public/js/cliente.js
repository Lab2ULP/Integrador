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
      console.log(turnos)

      // Renderizar los turnos en la lista
      listaTurnos.innerHTML = ""; // Limpiar la lista de turnos
      if (turnos.length === 0) {
        listaTurnos.innerHTML = '<li>-- No hay turnos disponibles --</li>';
        return;
      }

      // Agrupar turnos por fecha
      const turnosPorFecha = turnos.reduce((acc, turno) => {
        acc[turno.fecha] = acc[turno.fecha] || [];
        acc[turno.fecha].push(turno);
        return acc;
      }, {});

      // Renderizar turnos agrupados por fecha
      for (const fecha in turnosPorFecha) {
        // Encabezado para la fecha
        const fechaHeader = document.createElement("h3");
        fechaHeader.textContent = `Fecha: ${fecha}`;
        listaTurnos.appendChild(fechaHeader);

        // Lista de turnos para esta fecha
        const ul = document.createElement("ul");
        turnosPorFecha[fecha].forEach(turno => {
          const li = document.createElement("li");

          // Convertir estado a minúsculas para comparación
          const estadoNormalizado = turno.estado.toLowerCase();

          // Asignar clase según el estado del turno
          li.className = estadoNormalizado === "libre" ? "turno-libre" : "turno-ocupado";

          li.textContent = `Hora: ${turno.hora_inicio} - ${turno.hora_final}, Estado: ${turno.estado}`;
          

          if(turno.estado === "Libre"){
            const boton = document.createElement("button")
            const formulario = document.createElement("form")
            const texto = document.createElement("input")
            formulario.appendChild(texto)
            formulario.appendChild(boton)
            formulario.setAttribute("method","POST")
            formulario.action = "/turnos/reservar"
            boton.textContent='Reservar'
            texto.setAttribute("hidden",true)
            texto.value=turno.ID
            boton.addEventListener("click",async function() {

              fetch(`/turnos/reservar`)
              
            })
            ul.appendChild(li)
            ul.appendChild(formulario)
          }else{
            ul.appendChild(li);
            console.log("sali por aca")
          }

        });
        listaTurnos.appendChild(ul);
      }
    } catch (error) {
      console.error("Error al cargar turnos:", error);
      listaTurnos.innerHTML = '<li>-- Error al cargar turnos --</li>';
    }
  });
});
