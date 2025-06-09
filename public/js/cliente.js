const especialidadInput = document.getElementById("especialidad");
const especialidadDatalist = document.getElementById("especialidades");
const profesionalSelect = document.getElementById("profesional");
const btn = document.getElementById("btnSeleccionar");
const listaTurnos = document.getElementById("listaTurnos");

// Validación para solo letras y espacios en el buscador de especialidad
function soloLetras(input, btn) {
  input.addEventListener("input", function () {
    const soloLetras = /^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s-]+$/;
    btn.disabled = !(input.value === "" || soloLetras.test(input.value));
  });
}
soloLetras(especialidadInput, btn);

// Cuando cambia la especialidad, buscar el ID y pedir los profesionales
especialidadInput.addEventListener("input", function () {
  const val = especialidadInput.value;
  const option = Array.from(especialidadDatalist.options).find(
    (opt) => opt.value === val
  );
  if (option && option.dataset.id) {
    const especialidadID = option.dataset.id;
    profesionalSelect.disabled = false;
    profesionalSelect.innerHTML =
      '<option value="">Cargando profesionales...</option>';
    // Fetch para traer profesionales por especialidad
    fetch(`/pacientes/obtenerByEspecialidad/${especialidadID}`)
      .then((res) => res.json())
      .then((profesionales) => {
        profesionalSelect.innerHTML =
          '<option value="">-- Seleccione un profesional --</option>';
        profesionales.forEach((prof) => {
          const opt = document.createElement("option");
          opt.value = prof.id;
          opt.textContent = prof.nombre;
          profesionalSelect.appendChild(opt);
        });
      })
      .catch(() => {
        profesionalSelect.innerHTML =
          '<option value="">Error al cargar profesionales</option>';
      });
  } else {
    profesionalSelect.disabled = true;
    profesionalSelect.innerHTML =
      '<option value="">-- Seleccione un profesional --</option>';
    listaTurnos.innerHTML =
      "<li>Seleccione una especialidad y un profesional.</li>";
  }
});

// Al enviar el formulario, reemplazar el nombre de especialidad por el ID real
document
  .getElementById("filtroTurnos")
  .addEventListener("submit", function (e) {
    const val = especialidadInput.value;
    const option = Array.from(especialidadDatalist.options).find(
      (opt) => opt.value === val
    );
    if (option && option.dataset.id) {
      especialidadInput.value = option.dataset.id;
    }
  });

// Cuando seleccionás un profesional, cargar los turnos disponibles
profesionalSelect.addEventListener("change", async function () {
  const profesionalID = profesionalSelect.value;
  const val = especialidadInput.value;
  const option = Array.from(especialidadDatalist.options).find(
    (opt) => opt.value === val
  );
  const especialidadID = option ? option.dataset.id : null;

  listaTurnos.innerHTML = "<li>-- Cargando turnos --</li>";

  if (!profesionalID || !especialidadID) {
    listaTurnos.innerHTML =
      "<li>-- Seleccione un profesional y una especialidad --</li>";
    return;
  }

  try {
    // Fetch para obtener turnos según especialidad y profesional
    const response = await fetch(
      `/pacientes/obtenerTurnos/${profesionalID}/${especialidadID}`
    );
    const turnos = await response.json();

    // Renderizar los turnos en la lista
    listaTurnos.innerHTML = ""; // Limpiar la lista de turnos
    if (turnos.length === 0) {
      listaTurnos.innerHTML = "<li>-- No hay turnos disponibles --</li>";
      return;
    }

    // Agrupar turnos por fecha
    const turnosPorFecha = turnos.reduce((acc, turno) => {
      acc[turno.fecha] = acc[turno.fecha] || [];
      acc[turno.fecha].push(turno);
      return acc;
    }, {});

    // Renderizar turnos agrupados por fecha
    // Renderizar turnos agrupados por fecha
    for (const fecha in turnosPorFecha) {
      // Encabezado para la fecha
      const fechaHeader = document.createElement("h3");
      fechaHeader.textContent = `Fecha: ${fecha}`;
      listaTurnos.appendChild(fechaHeader);

      // Lista de turnos para esta fecha
      const ul = document.createElement("ul");
      turnosPorFecha[fecha].forEach((turno) => {
        const li = document.createElement("li");
        const estadoNormalizado = turno.estado.toLowerCase();
        li.className =
          estadoNormalizado === "libre" ? "turno-libre" : "turno-ocupado";
        li.textContent = `Hora: ${turno.hora_inicio} - ${turno.hora_final}, Estado: ${turno.estado}`;
        if (turno.estado === "Libre") {
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
          li.appendChild(formulario);
        }
        ul.appendChild(li);
      });
      listaTurnos.appendChild(ul);
    }
  } catch (error) {
    console.error("Error al cargar turnos:", error);
    listaTurnos.innerHTML = "<li>-- Error al cargar turnos --</li>";
  }
});
