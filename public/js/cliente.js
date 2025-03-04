/*document.addEventListener("DOMContentLoaded", () => {
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
            formulario.action = `/turnos/reservar/${turno.ID}`
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
});*/

document.addEventListener("DOMContentLoaded", () => {
  // Elementos del DOM
  const especialidadSelect = document.getElementById("especialidad");
  const profesionalSelect = document.getElementById("profesional");
  const listaTurnos = document.getElementById("listaTurnos");

  // Constantes para mensajes reutilizables
  const MENSAJES = {
    cargandoTurnos: "-- Cargando turnos --",
    sinProfesional: "-- Seleccione un profesional y una especialidad --",
    sinTurnos: "-- No hay turnos disponibles --",
    error: "-- Error al cargar turnos --"
  };

  // Función genérica para realizar solicitudes fetch con manejo de errores
  async function fetchData(url) {
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error("Error en la respuesta del servidor");
      return await response.json();
    } catch (error) {
      console.error("Error en fetch:", error);
      mostrarError("No se pudo cargar la información. Intente nuevamente.");
      throw error; // Propagar el error para detener la ejecución
    }
  }

  // Mostrar mensaje de error en la interfaz
  function mostrarError(mensaje) {
    listaTurnos.innerHTML = `<li class="error">${mensaje}</li>`;
  }

  // Renderizar opciones de profesionales en el select
  function renderProfesionales(profesionales) {
    profesionalSelect.innerHTML = '<option value="">-- Seleccione un profesional --</option>';
    profesionales.forEach(profesional => {
      const option = document.createElement("option");
      option.value = profesional.id;
      option.textContent = profesional.nombre;
      profesionalSelect.appendChild(option);
    });
    profesionalSelect.disabled = false;
  }

  // Agrupar turnos por fecha
  function agruparTurnosPorFecha(turnos) {
    return turnos.reduce((acc, turno) => {
      acc[turno.fecha] = acc[turno.fecha] || [];
      acc[turno.fecha].push(turno);
      return acc;
    }, {});
  }

  // Renderizar lista de turnos agrupados por fecha
  function renderTurnosPorFecha(turnos) {
    listaTurnos.innerHTML = ""; // Limpiar la lista de turnos
    const turnosPorFecha = agruparTurnosPorFecha(turnos);
    for (const fecha in turnosPorFecha) {
      const fechaHeader = document.createElement("h3");
      fechaHeader.textContent = `Fecha: ${fecha}`;
      listaTurnos.appendChild(fechaHeader);

      const ul = document.createElement("ul");
      turnosPorFecha[fecha].forEach(turno => {
        ul.appendChild(renderTurno(turno));
      });
      listaTurnos.appendChild(ul);
    }
  }

  // Crear formulario para reservar un turno
  function crearFormularioReservar(turno) {
    const formulario = document.createElement("form");
    formulario.method = "POST";
    formulario.action = `/turnos/reservar/${turno.ID}`;

    const inputID = document.createElement("input");
    inputID.type = "hidden";
    inputID.name = "turnoID";
    inputID.value = turno.ID;

    const boton = document.createElement("button");
    boton.type = "submit";
    boton.textContent = "Reservar";

    formulario.appendChild(inputID);
    formulario.appendChild(boton);
    return formulario;
  }

  // Renderizar un turno individual
  function renderTurno(turno) {
    const li = document.createElement("li");
    li.className = `turno ${turno.estado.toLowerCase()}`; // Clases dinámicas
    li.textContent = `Hora: ${turno.hora_inicio} - ${turno.hora_final}, Estado: ${turno.estado}`;
    if (turno.estado === "Libre") {
      li.appendChild(crearFormularioReservar(turno));
    }
    return li;
  }

  // Evento al cambiar la especialidad
  especialidadSelect.addEventListener("change", async function () {
    const especialidadID = this.value;
    profesionalSelect.disabled = true;
    listaTurnos.innerHTML = MENSAJES.sinProfesional;

    if (!especialidadID) return; // Si no se selecciona especialidad, salir

    try {
      const profesionales = await fetchData(`/pacientes/obtenerByEspecialidad/${especialidadID}`);
      renderProfesionales(profesionales);
    } catch (error) {
      mostrarError(MENSAJES.error);
    }
  });

  // Evento al cambiar el profesional
  profesionalSelect.addEventListener("change", async function () {
    const profesionalID = this.value;
    const especialidadID = especialidadSelect.value;
    listaTurnos.innerHTML = MENSAJES.cargandoTurnos;

    if (!profesionalID || !especialidadID) {
      listaTurnos.innerHTML = MENSAJES.sinProfesional;
      return;
    }

    try {
      const turnos = await fetchData(`/pacientes/obtenerTurnos/${profesionalID}/${especialidadID}`);
      if (turnos.length === 0) {
        listaTurnos.innerHTML = MENSAJES.sinTurnos;
        return;
      }
      renderTurnosPorFecha(turnos);
    } catch (error) {
      mostrarError(MENSAJES.error);
    }
  });
});
