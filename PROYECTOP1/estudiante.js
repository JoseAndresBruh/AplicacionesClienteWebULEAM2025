// --- SIMULACIÓN DE DATOS GLOBALES (Reemplazo de la Base de Datos) ---

// Fechas de clases de prueba (usaremos JavaScript Date para calcular la elegibilidad de 7 días)
const today = new Date();
const oneWeekAgo = new Date(today.getTime() - (7 * 24 * 60 * 60 * 1000));
const fifteenDaysAgo = new Date(today.getTime() - (15 * 24 * 60 * 60 * 1000));

// Función de utilidad para formatear la fecha como YYYY-MM-DD
const formatDate = (date) => date.toISOString().split('T')[0];

const STUDENT_DATA = {
    // Definición de cursos
    cursos: [
        { id: 'mat', nombre: 'Matemáticas Avanzadas', totalClases: 20 },
        { id: 'prog', nombre: 'Programación Web I', totalClases: 25 },
        { id: 'soft', nombre: 'Ingeniería de Software', totalClases: 30 }
    ],
    // Asistencias del estudiante de prueba
    asistencias: [
        // Matemáticas Avanzadas
        { cursoId: 'mat', fecha: formatDate(fifteenDaysAgo), tema: 'Integrales de Volumen', estado: 'Asistió' },
        { cursoId: 'mat', fecha: formatDate(oneWeekAgo), tema: 'Ecuaciones Diferenciales', estado: 'No Asistió' }, // Justificable por poco
        { cursoId: 'mat', fecha: formatDate(new Date(today.getTime() - (2 * 24 * 60 * 60 * 1000))), tema: 'Series de Fourier', estado: 'No Asistió' }, // Muy reciente, Justificable
        { cursoId: 'mat', fecha: formatDate(new Date(today.getTime() - (20 * 24 * 60 * 60 * 1000))), tema: 'Números Complejos', estado: 'No Asistió' }, // NO Justificable (Plazo Expirado)
        { cursoId: 'mat', fecha: formatDate(new Date(today.getTime() - (1 * 24 * 60 * 60 * 1000))), tema: 'Teorema de Green', estado: 'Justificado' }, // Ya Justificada
        { cursoId: 'mat', fecha: formatDate(today), tema: 'Repaso Final', estado: 'Asistió' },
        
        // Programación Web I
        { cursoId: 'prog', fecha: formatDate(new Date(today.getTime() - (5 * 24 * 60 * 60 * 1000))), tema: 'Fundamentos de JavaScript', estado: 'Asistió' },
        { cursoId: 'prog', fecha: formatDate(new Date(today.getTime() - (3 * 24 * 60 * 60 * 1000))), tema: 'Manejo del DOM', estado: 'No Asistió' }, // Justificable
    ]
};
// Variable global para almacenar el detalle de la falta seleccionada
let selectedFalta = null;

// ------------------------------------------------------------------------

document.addEventListener('DOMContentLoaded', () => {
    // 1. Verificación del Rol y Mensaje de Bienvenida
    const userRole = localStorage.getItem('userRole');
    const userName = localStorage.getItem('userName'); // <-- Toma el nombre completo

    
    if (userRole !== 'estudiante') {
        alert('Acceso denegado. Redirigiendo al login.');
        window.location.href = 'index.html';
        return;
    }
    
    // Muestra el nombre completo (debería ser "José Loor")
    const studentNameDisplay = userName || 'Error al cargar nombre'; 
    document.getElementById('student-name-display').textContent = studentNameDisplay;


    // 2. Llenar el Dropdown de Cursos
    const cursoSelect = document.getElementById('curso-select');
    STUDENT_DATA.cursos.forEach(curso => {
        const option = document.createElement('option');
        option.value = curso.id;
        option.textContent = curso.nombre;
        cursoSelect.appendChild(option);
    });

    // 3. Cargar datos al seleccionar un curso
    cursoSelect.addEventListener('change', loadAsistenciaTable);

    // Cargar la tabla al inicio con el primer curso
    if (STUDENT_DATA.cursos.length > 0) {
        loadAsistenciaTable();
    }
});

function loadAsistenciaTable() {
    const cursoId = document.getElementById('curso-select').value;
    const tablaBody = document.querySelector('#asistencia-table tbody');
    tablaBody.innerHTML = ''; // Limpiar la tabla

    const asistenciasCurso = STUDENT_DATA.asistencias.filter(a => a.cursoId === cursoId);
    let faltasCount = 0;
    let asistioCount = 0; // Para el cálculo del porcentaje
    
    asistenciasCurso.forEach(item => {
        let estadoClase = '';
        let accionHtml = '';
        const claseDate = new Date(item.fecha);
        const diffDays = Math.ceil((new Date() - claseDate) / (1000 * 60 * 60 * 24)); // Diferencia en días
        
        const isEligibleForJustification = (item.estado === 'No Asistió' && diffDays <= 7);
        const isPastDue = (item.estado === 'No Asistió' && diffDays > 7);

        // Definir clases de estado y contar
        if (item.estado === 'Asistió') {
            estadoClase = 'status-asistio';
            asistioCount++;
        } else if (item.estado === 'Justificado') {
            estadoClase = 'status-justificado';
            asistioCount++; // Justificada cuenta como asistencia para el porcentaje
        } else if (item.estado === 'Pendiente de Revisión') {
            estadoClase = 'status-pendiente';
            faltasCount++; // Pendiente sigue siendo una 'falta' para el porcentaje hasta ser aprobada
            accionHtml = 'Pendiente de Revisión';
        } else {
            // Estado 'No Asistió'
            estadoClase = 'status-no-asistio';
            faltasCount++;
            
            if (isEligibleForJustification) {
                accionHtml = `<a href="#" onclick="event.preventDefault(); openModal('${item.fecha}', '${item.tema}', '${item.cursoId}')">Solicitar Justificación</a>`;
            } else if (isPastDue) {
                accionHtml = 'Plazo Expirado';
            }
        }

        // Crear fila de la tabla
        const row = tablaBody.insertRow();
        row.innerHTML = `
            <td>${item.fecha}</td>
            <td>${item.tema}</td>
            <td class="${estadoClase}">${item.estado}</td>
            <td>${accionHtml}</td>
        `;
    });
    
    // 4. Calcular y mostrar el porcentaje de asistencia
    const totalClasesEnCurso = asistenciasCurso.length;
    let percent = 0;
    if (totalClasesEnCurso > 0) {
        // Porcentaje: (Asistió + Justificado) / Total Clases
        percent = (asistioCount / totalClasesEnCurso) * 100;
    }

    document.getElementById('percent-display').textContent = `${percent.toFixed(1)}%`;
}

// ------------------- LÓGICA DEL MODAL DE JUSTIFICACIÓN -------------------

function openModal(fecha, tema, cursoId) {
    selectedFalta = { fecha, tema, cursoId }; 
    
    document.getElementById('falta-detalle').textContent = `${tema} (${fecha})`;
    document.getElementById('justificacion-modal').style.display = 'block';
}

function closeModal() {
    document.getElementById('justificacion-modal').style.display = 'none';
    document.getElementById('justificacionForm').reset();
    selectedFalta = null;
}

function openSuccessModal() {
    document.getElementById('success-modal').style.display = 'block';
}

function closeSuccessModal() {
    document.getElementById('success-modal').style.display = 'none';
}


// Manejar el envío del formulario de justificación
document.getElementById('justificacionForm').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const motivo = document.getElementById('motivo').value;
    const documento = document.getElementById('documento').files[0];
    
    if (!motivo || !documento) {
        alert('Por favor, complete el motivo y adjunte el documento.');
        return;
    }

    const index = STUDENT_DATA.asistencias.findIndex(a => 
        a.fecha === selectedFalta.fecha && a.cursoId === selectedFalta.cursoId
    );

    if (index !== -1) {
        STUDENT_DATA.asistencias[index].estado = 'Pendiente de Revisión';
        openSuccessModal();
        loadAsistenciaTable(); 
    }

    closeModal();
});

function logout() {
    localStorage.removeItem('userRole');
    localStorage.removeItem('userName');
    localStorage.removeItem('userCorreo');
    window.location.href = 'index.html';
}

// Cierra el modal si el usuario hace clic fuera de él
window.onclick = function(event) {
    const modalJustificacion = document.getElementById('justificacion-modal');
    const modalSuccess = document.getElementById('success-modal');

    if (event.target === modalJustificacion) {
        closeModal();
    }
    if (event.target === modalSuccess) {
        closeSuccessModal();
    }
}