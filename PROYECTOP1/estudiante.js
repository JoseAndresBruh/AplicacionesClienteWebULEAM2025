// --- SIMULACIÓN DE DATOS GLOBALES (Reemplazo de la Base de Datos) ---

// Fechas de clases de prueba (usaremos JavaScript Date para calcular la elegibilidad de 7 días)
const today = new Date();
const oneWeekAgo = new Date(today.getTime() - (7 * 24 * 60 * 60 * 1000));
const fifteenDaysAgo = new Date(today.getTime() - (15 * 24 * 60 * 60 * 1000));

// Función de utilidad para formatear la fecha como YYYY-MM-DD
const formatDate = (date) => date.toISOString().split('T')[0];

// --- PERSISTENCIA CON LOCALSTORAGE (Compartido con docente.js) ---

const loadJustificacionesGlobal = () => {
    const storedJustificaciones = localStorage.getItem('justificacionesGlobal');
    if (storedJustificaciones) {
        return JSON.parse(storedJustificaciones);
    }
    // FIX: Sincronizado con docente.js para no perder la justificación de prueba si se inicia como estudiante
    return [
        { 
            cursoId: 'mat', 
            estudianteCedula: '1301010101', 
            fecha: '2025-10-15', 
            motivo: 'Cita médica urgente. Adjunto certificado original del IESS.', 
            estado: 'Pendiente',
            adjuntoUrl: 'https://ejemplo.com/adjunto/cedula1301010101_20251015.pdf' 
        },
    ]; 
};

const saveJustificacionesGlobal = (justificaciones) => {
    localStorage.setItem('justificacionesGlobal', JSON.stringify(justificaciones));
};

// Función para obtener la cédula simulada del estudiante logueado
function getStudentCedula() {
    const userCorreo = localStorage.getItem('userCorreo');
    // Mapeo simple: 'estudiante@uleam.edu.ec' corresponde a la cédula '1301010101' en DOCENTE_DATA
    if (userCorreo === 'estudiante@uleam.edu.ec') return '1301010101'; 
    return '1301010101'; // Fallback por si el docente hace pruebas con su correo
}


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
        { cursoId: 'mat', fecha: '2025-10-15', tema: 'Derivadas', estado: 'No Asistió' }, // Falta para probar la predeterminada
        { cursoId: 'mat', fecha: formatDate(new Date()), tema: 'Vectores Ortogonales', estado: 'Asistió' }, 
        
        // Programación Web I
        { cursoId: 'prog', fecha: '2025-10-20', tema: 'HTML Semántico', estado: 'Asistió' },
        { cursoId: 'prog', fecha: '2025-10-21', tema: 'CSS Flexbox', estado: 'No Asistió' }, 
        { cursoId: 'prog', fecha: '2025-10-22', tema: 'JavaScript ES6', estado: 'Justificado' },
        { cursoId: 'prog', fecha: '2025-10-23', tema: 'APIs REST', estado: 'Asistió' },
        
        // Ingeniería de Software (ejemplo de falta no justificable por tiempo)
        { cursoId: 'soft', fecha: '2025-08-01', tema: 'Requisitos Funcionales', estado: 'No Asistió' }, 
    ],
    // La lista de justificaciones ahora se gestiona en el localStorage
};

let selectedFalta = null; // Para almacenar la falta a justificar

document.addEventListener('DOMContentLoaded', () => {
    const userRole = localStorage.getItem('userRole');
    const userName = localStorage.getItem('userName');
    
    if (userRole !== 'estudiante') {
        alert('Acceso denegado. Redirigiendo al login.');
        window.location.href = 'index.html';
        return;
    }

    document.getElementById('student-name-display').textContent = userName || 'Estudiante';
    loadAsistenciaTable();
});

function loadAsistenciaTable() {
    const tableBody = document.querySelector('#asistencia-table tbody');
    tableBody.innerHTML = '';
    
    // Cargar justificaciones globales para verificar el estado de las faltas
    const justificacionesGlobal = loadJustificacionesGlobal();
    const estudianteCedula = getStudentCedula();

    // Agrupar asistencias por curso
    const asistenciasPorCurso = STUDENT_DATA.asistencias.reduce((acc, current) => {
        const curso = STUDENT_DATA.cursos.find(c => c.id === current.cursoId);
        if (!acc[current.cursoId]) {
            acc[current.cursoId] = {
                nombre: curso ? curso.nombre : 'Curso Desconocido',
                totalClases: curso ? curso.totalClases : 0,
                faltas: 0,
                registros: []
            };
        }
        acc[current.cursoId].registros.push(current);
        if (current.estado === 'No Asistió') {
            acc[current.cursoId].faltas++;
        }
        return acc;
    }, {});

    // Renderizar la tabla
    for (const cursoId in asistenciasPorCurso) {
        const cursoData = asistenciasPorCurso[cursoId];
        
        // 1. Fila de Resumen por Curso
        const summaryRow = tableBody.insertRow();
        summaryRow.classList.add('curso-summary');
        
        // Colspan ajustado a 2 en la celda de Curso
        summaryRow.innerHTML = `
            <td data-label="Curso" colspan="2"><strong>${cursoData.nombre}</strong></td>
            <td data-label="Total Clases">${cursoData.totalClases}</td>
            <td data-label="Faltas">${cursoData.faltas}</td>
            <td data-label="Detalle"><button class="btn-secondary btn-small" onclick="toggleDetails('${cursoId}')">Ver/Ocultar Detalle</button></td>
        `;

        // 2. Filas de Detalle
        const detailRow = tableBody.insertRow();
        detailRow.classList.add('curso-detail-row');
        detailRow.id = `detail-${cursoId}`;
        detailRow.style.display = 'none';

        // Celda que contiene la sub-tabla
        const detailCell = detailRow.insertCell(0);
        // Colspan ajustado a 5 (igual que las columnas visibles en la tabla principal)
        detailCell.colSpan = 5; 
        
        let detailHtml = `
            <table class="detail-table">
                <thead>
                    <tr>
                        <th>Fecha</th>
                        <th>Tema</th>
                        <th>Estado</th>
                        <th>Acción</th>
                    </tr>
                </thead>
                <tbody>
        `;

        cursoData.registros.sort((a, b) => new Date(b.fecha) - new Date(a.fecha)).forEach(asistencia => {
            let statusClass = '';
            let actionHtml = '';
            
            // Lógica de Justificación
            if (asistencia.estado === 'No Asistió') {
                statusClass = 'status-no-asistio';
                const today = new Date();
                const faltaDate = new Date(asistencia.fecha);
                const diffTime = Math.abs(today - faltaDate);
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                
                const isJustifiable = diffDays <= 7;
                
                // Verificar el estado en el listado global, usando los 3 identificadores únicos
                const justificacionSent = justificacionesGlobal.find(j => 
                    j.estudianteCedula === estudianteCedula && 
                    j.cursoId === asistencia.cursoId && 
                    j.fecha === asistencia.fecha
                );

                if (justificacionSent) {
                    if (justificacionSent.estado === 'Pendiente') {
                        actionHtml = '<span class="status-pendiente">En Revisión</span>';
                    } else if (justificacionSent.estado === 'Aprobada') {
                        actionHtml = '<span class="status-justificado">Aprobada</span>';
                    } else if (justificacionSent.estado === 'Rechazada') {
                        actionHtml = '<span class="status-danger">Rechazada</span>';
                    }
                } else if (isJustifiable) {
                    actionHtml = `<button class="btn-success btn-small" onclick="openJustificacionModal('${asistencia.fecha}', '${asistencia.cursoId}')">Justificar</button>`;
                } else {
                    actionHtml = '<span class="status-danger">Plazo Excedido</span>';
                }
            } else if (asistencia.estado === 'Justificado') {
                statusClass = 'status-justificado';
            } else if (asistencia.estado === 'Asistió') {
                statusClass = 'status-asistio';
            }
            
            detailHtml += `
                <tr>
                    <td>${asistencia.fecha}</td>
                    <td>${asistencia.tema}</td>
                    <td class="${statusClass}">${asistencia.estado}</td>
                    <td>${actionHtml}</td>
                </tr>
            `;
        });
        
        detailHtml += `</tbody></table>`;
        detailCell.innerHTML = detailHtml;
    }
}

function toggleDetails(cursoId) {
    const detailRow = document.getElementById(`detail-${cursoId}`);
    if (detailRow.style.display === 'none') {
        detailRow.style.display = 'table-row';
    } else {
        detailRow.style.display = 'none';
    }
}


function openJustificacionModal(fecha, cursoId) {
    const curso = STUDENT_DATA.cursos.find(c => c.id === cursoId);
    
    selectedFalta = { fecha, cursoId };
    
    document.getElementById('falta-detalle').textContent = `${curso.nombre} - Fecha: ${fecha}`;
    document.getElementById('justificacion-modal').style.display = 'block';
}

function closeModal() {
    document.getElementById('justificacion-modal').style.display = 'none';
}

function openSuccessModal() {
    document.querySelector('#success-modal h3').textContent = '¡Éxito!';
    document.querySelector('#success-modal p').textContent = 'Su solicitud de justificación ha sido enviada con éxito y está pendiente de revisión por el docente.';
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

    // LÓGICA DE SUBMISIÓN (Simulación de adjunto)
    const estudianteCedula = getStudentCedula(); 
    // Simulación de una URL para que el docente pueda ver el "adjunto"
    const simulatedUrl = `https://ejemplo.com/adjunto/${estudianteCedula}_${selectedFalta.fecha}_${Date.now()}.pdf`; // Añadimos un timestamp para asegurar unicidad
    
    // 1. Crear el objeto de justificación
    const newJustificacion = {
        cursoId: selectedFalta.cursoId, 
        estudianteCedula: estudianteCedula, 
        fecha: selectedFalta.fecha, 
        motivo: motivo,
        adjuntoUrl: simulatedUrl,
        estado: 'Pendiente'
    };
    
    // 2. Cargar la lista global, añadir la nueva justificación y guardar
    let justificacionesGlobal = loadJustificacionesGlobal();
    justificacionesGlobal.push(newJustificacion); // Esto garantiza que siempre se AÑADE un nuevo elemento.
    saveJustificacionesGlobal(justificacionesGlobal);

    // 3. Notificar y actualizar la tabla
    openSuccessModal();
    loadAsistenciaTable(); 

    // 4. Limpiar
    document.getElementById('justificacionForm').reset();
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

    if (event.target == modalJustificacion) {
        modalJustificacion.style.display = "none";
    }
    if (event.target == modalSuccess) {
        modalSuccess.style.display = "none";
    }
}