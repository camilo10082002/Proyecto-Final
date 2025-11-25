const URL_MOCK = "https://TU_URL.mockable.io/carreras";

let estudiantes = [];

// Inicializar leyendo localStorage
window.onload = () => {
    const data = localStorage.getItem("estudiantes");
    if (data) estudiantes = JSON.parse(data);

    cargarCarreras();
    listarEstudiantes();
};

// Cambiar secciones
function mostrarSeccion(id) {
    document.querySelectorAll(".seccion").forEach(s => s.classList.add("oculto"));
    document.getElementById(id).classList.remove("oculto");
}

// Cargar carreras desde mockable.io
function cargarCarreras() {
    fetch(URL_MOCK)
        .then(res => res.json())
        .then(data => {
            const select = document.getElementById("carrera");
            data.carreras.forEach(c => {
                const option = document.createElement("option");
                option.value = c;
                option.textContent = c;
                select.append(option);
            });
        })
        .catch(() => alert("Error cargando carreras desde Mockable"));
}

// Crear estudiante
document.getElementById("formCrear").addEventListener("submit", e => {
    e.preventDefault();

    const nuevo = {
        id: estudiantes.length,
        nombres: document.getElementById("nombres").value,
        apellidos: document.getElementById("apellidos").value,
        edad: document.getElementById("edad").value,
        carrera: document.getElementById("carrera").value,
        estrato: document.getElementById("estrato").value
    };

    estudiantes.push(nuevo);
    guardarLocalStorage();
    listarEstudiantes();
    alert("Estudiante agregado correctamente");
    e.target.reset();
});

// Mostrar tabla
function listarEstudiantes() {
    const tabla = document.getElementById("tablaEstudiantes");
    tabla.innerHTML = "";

    estudiantes.forEach(est => {
        const fila = document.createElement("tr");
        fila.innerHTML = `
            <td>${est.id}</td>
            <td>${est.nombres}</td>
            <td>${est.apellidos}</td>
            <td>${est.edad}</td>
            <td>${est.carrera}</td>
            <td>${est.estrato}</td>
        `;
        tabla.append(fila);
    });
}

// Guardar localStorage
function guardarLocalStorage() {
    localStorage.setItem("estudiantes", JSON.stringify(estudiantes));
}

// Eliminar estudiante
function eliminarEstudiante() {
    const id = parseInt(document.getElementById("idEliminar").value);

    if (isNaN(id) || id < 0 || id >= estudiantes.length) {
        alert("ID inválido");
        return;
    }

    estudiantes = estudiantes.filter(est => est.id !== id);

    // Reasignar IDs
    estudiantes.forEach((e, i) => e.id = i);

    guardarLocalStorage();
    listarEstudiantes();

    alert("Estudiante eliminado");
}
