// Variables globales
let estudiantes = [];
let carreras = [];

// Elementos del DOM
const secciones = {
    crear: document.getElementById('seccionCrear'),
    listar: document.getElementById('seccionListar'),
    eliminar: document.getElementById('seccionEliminar')
};

const botonesNavegacion = {
    crear: document.getElementById('btnCrear'),
    listar: document.getElementById('btnListar'),
    eliminar: document.getElementById('btnEliminar')
};

// Inicialización de la aplicación
document.addEventListener('DOMContentLoaded', function() {
    inicializarApp();
    
    // Event listeners para navegación
    botonesNavegacion.crear.addEventListener('click', () => mostrarSeccion('crear'));
    botonesNavegacion.listar.addEventListener('click', () => mostrarSeccion('listar'));
    botonesNavegacion.eliminar.addEventListener('click', () => mostrarSeccion('eliminar'));
    
    // Event listeners para formularios
    document.getElementById('formEstudiante').addEventListener('submit', crearEstudiante);
    document.getElementById('btnConfirmarEliminar').addEventListener('click', eliminarEstudiante);
    
    // Event listener para mostrar información del estudiante a eliminar
    document.getElementById('idEliminar').addEventListener('input', function() {
        const id = parseInt(this.value);
        const estudianteInfo = document.getElementById('estudianteAEliminar');
        
        if (!isNaN(id) && id >= 0 && id < estudiantes.length) {
            const estudiante = estudiantes[id];
            estudianteInfo.innerHTML = `
                <h3>Información del estudiante a eliminar:</h3>
                <p><strong>ID:</strong> ${estudiante.id}</p>
                <p><strong>Nombres:</strong> ${estudiante.nombres}</p>
                <p><strong>Apellidos:</strong> ${estudiante.apellidos}</p>
                <p><strong>Edad:</strong> ${estudiante.edad}</p>
                <p><strong>Carrera:</strong> ${estudiante.carrera}</p>
                <p><strong>Estrato:</strong> ${estudiante.estrato}</p>
            `;
        } else {
            estudianteInfo.innerHTML = '';
        }
    });
});

// Función para inicializar la aplicación
function inicializarApp() {
    cargarEstudiantes();
    cargarCarreras();
    mostrarSeccion('crear');
}

// Función para cargar estudiantes desde localStorage
function cargarEstudiantes() {
    const estudiantesGuardados = localStorage.getItem('estudiantes');
    if (estudiantesGuardados) {
        estudiantes = JSON.parse(estudiantesGuardados);
    } else {
        // Datos de ejemplo como en la imagen
        estudiantes = [
            { id: 0, nombres: "Carlos", apellidos: "Perez", edad: 32, carrera: "T.P. Sistemas", estrato: 1 },
            { id: 1, nombres: "Diana", apellidos: "Trejos", edad: 25, carrera: "Contabilidad", estrato: 3 },
            { id: 2, nombres: "Juan", apellidos: "Perez", edad: 40, carrera: "Ing. Mecanica", estrato: 2 }
        ];
        guardarEstudiantes();
    }
}

// Función para cargar carreras desde el servicio externo
async function cargarCarreras() {
    try {
        // Usando mockable.io como servicio externo
        const response = await fetch('http://demo1177330.mockable.io/carreras');
        if (!response.ok) {
            throw new Error('Error al cargar las carreras');
        }
        const data = await response.json();
        carreras = data.carreras;
        
        // Llenar el select de carreras
        llenarSelectCarreras(document.getElementById('carrera'));
    } catch (error) {
        console.error('Error:', error);
        // Si falla la conexión, usar carreras por defecto
        carreras = [
            "T.P. Sistemas",
            "Contabilidad",
            "Ing. Mecanica",
            "Administración de Empresas",
            "Derecho",
            "Medicina",
            "Psicología"
        ];
        
        // Llenar el select de carreras con las opciones por defecto
        llenarSelectCarreras(document.getElementById('carrera'));
    }
}

// Función para llenar un select con las carreras disponibles
function llenarSelectCarreras(selectElement) {
    // Limpiar opciones existentes (excepto la primera)
    while (selectElement.options.length > 1) {
        selectElement.remove(1);
    }
    
    // Agregar las carreras
    carreras.forEach(carrera => {
        const option = document.createElement('option');
        option.value = carrera;
        option.textContent = carrera;
        selectElement.appendChild(option);
    });
}

// Función para mostrar una sección específica y ocultar las demás
function mostrarSeccion(seccion) {
    // Ocultar todas las secciones
    Object.values(secciones).forEach(s => {
        s.classList.remove('seccion-activa');
        s.classList.add('seccion-oculta');
    });
    
    // Remover la clase active de todos los botones
    Object.values(botonesNavegacion).forEach(boton => {
        boton.classList.remove('active');
    });
    
    // Mostrar la sección seleccionada y marcar el botón como activo
    secciones[seccion].classList.remove('seccion-oculta');
    secciones[seccion].classList.add('seccion-activa');
    botonesNavegacion[seccion].classList.add('active');
    
    // Si es la sección de listar, actualizar la lista
    if (seccion === 'listar') {
        mostrarListaEstudiantes();
    }
    
    // Si es la sección de eliminar, limpiar el campo
    if (seccion === 'eliminar') {
        document.getElementById('idEliminar').value = '';
        document.getElementById('estudianteAEliminar').innerHTML = '';
    }
}

// Función para crear un nuevo estudiante
function crearEstudiante(event) {
    event.preventDefault();
    
    // Obtener los valores del formulario
    const nombres = document.getElementById('nombres').value;
    const apellidos = document.getElementById('apellidos').value;
    const edad = parseInt(document.getElementById('edad').value);
    const carrera = document.getElementById('carrera').value;
    const estrato = parseInt(document.getElementById('estrato').value);
    
    // Crear el nuevo estudiante
    const nuevoEstudiante = {
        id: estudiantes.length,
        nombres,
        apellidos,
        edad,
        carrera,
        estrato
    };
    
    // Agregar el estudiante a la lista
    estudiantes.push(nuevoEstudiante);
    
    // Guardar en localStorage
    guardarEstudiantes();
    
    // Mostrar mensaje de éxito
    mostrarMensaje('Estudiante creado exitosamente', 'exito');
    
    // Limpiar el formulario
    document.getElementById('formEstudiante').reset();
    
    // Actualizar la lista si estamos en esa sección
    if (secciones.listar.classList.contains('seccion-activa')) {
        mostrarListaEstudiantes();
    }
}

// Función para mostrar la lista de estudiantes
function mostrarListaEstudiantes() {
    const listaEstudiantes = document.getElementById('listaEstudiantes');
    
    if (estudiantes.length === 0) {
        listaEstudiantes.innerHTML = '<p>No hay estudiantes registrados.</p>';
        return;
    }
    
    // Crear la tabla
    let tablaHTML = `
        <table>
            <thead>
                <tr>
                    <th>Nombre</th>
                    <th>Apellido</th>
                    <th>Edad</th>
                    <th>Carrera</th>
                    <th>Estrato</th>
                </tr>
            </thead>
            <tbody>
    `;
    
    estudiantes.forEach(estudiante => {
        tablaHTML += `
            <tr>
                <td>${estudiante.nombres}</td>
                <td>${estudiante.apellidos}</td>
                <td>${estudiante.edad}</td>
                <td>${estudiante.carrera}</td>
                <td>${estudiante.estrato}</td>
            </tr>
        `;
    });
    
    tablaHTML += `
            </tbody>
        </table>
    `;
    
    listaEstudiantes.innerHTML = tablaHTML;
}

// Función para eliminar un estudiante
function eliminarEstudiante() {
    const idEliminar = parseInt(document.getElementById('idEliminar').value);
    
    // Validar que el ID sea válido
    if (isNaN(idEliminar) || idEliminar < 0 || idEliminar >= estudiantes.length) {
        mostrarMensaje('ID de estudiante no válido', 'error');
        return;
    }
    
    // Confirmar eliminación
    if (confirm(`¿Está seguro de que desea eliminar al estudiante con ID ${idEliminar}?`)) {
        // Eliminar el estudiante
        estudiantes.splice(idEliminar, 1);
        
        // Reasignar IDs
        estudiantes.forEach((estudiante, index) => {
            estudiante.id = index;
        });
        
        // Guardar en localStorage
        guardarEstudiantes();
        
        // Mostrar mensaje de éxito
        mostrarMensaje('Estudiante eliminado exitosamente', 'exito');
        
        // Limpiar el campo y la información mostrada
        document.getElementById('idEliminar').value = '';
        document.getElementById('estudianteAEliminar').innerHTML = '';
        
        // Actualizar la lista si estamos en esa sección
        if (secciones.listar.classList.contains('seccion-activa')) {
            mostrarListaEstudiantes();
        }
    }
}

// Función para guardar estudiantes en localStorage
function guardarEstudiantes() {
    localStorage.setItem('estudiantes', JSON.stringify(estudiantes));
}

// Función para mostrar mensajes
function mostrarMensaje(mensaje, tipo) {
    // Crear elemento de mensaje
    const mensajeElement = document.createElement('div');
    mensajeElement.className = `mensaje mensaje-${tipo}`;
    mensajeElement.textContent = mensaje;
    
    // Insertar el mensaje al principio del main
    const main = document.querySelector('main');
    main.insertBefore(mensajeElement, main.firstChild);
    
    // Eliminar el mensaje después de 3 segundos
    setTimeout(() => {
        mensajeElement.remove();
    }, 3000);
}
