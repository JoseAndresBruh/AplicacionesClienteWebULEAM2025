// --- SIMULACIÓN DE DATOS DEL DOCENTE (Reemplazo de la Base de Datos) ---

const getTodayDate = () => new Date().toISOString().split('T')[0];
const formatDate = (date) => {
    if (typeof date === 'string') date = new Date(date);
    return date.toISOString().split('T')[0];
};

const DOCENTE_DATA = {
    cursos: [
        { id: 'mat', nombre: 'Matemáticas Avanzadas', paralelos: ['A', 'B'] },
        { id: 'prog', nombre: 'Programación Web I', paralelos: ['A', 'B', 'C'] },
    ],
    // Estudiantes (simulados)
    estudiantes: [
        { cedula: '1301010101', nombre: 'Dreemurr Asriel', cursoId: 'mat', paralelo: 'A' },
        { cedula: '1313131313', nombre: 'Sans E. Skeleton', cursoId: 'mat', paralelo: 'A' },
        { cedula: '1300112233', nombre: 'Gómez Ana Sofía', cursoId: 'mat', paralelo: 'A' },
        { cedula: '1300000001', nombre: 'Ramírez José P.', cursoId: 'mat', paralelo: 'A' },
        { cedula: '1300000002', nombre: 'Vásquez María T.', cursoId: 'mat', paralelo: 'A' },
        { cedula: '1300445566', nombre: 'Pérez Carlos A.', cursoId: 'mat', paralelo: 'B' },
        { cedula: '1300778899', nombre: 'Rodas María F.', cursoId: 'mat', paralelo: 'B' },
        { cedula: '0909090909', nombre: 'Windings Goster', cursoId: 'prog', paralelo: 'A' },
        { cedula: '1305456789', nombre: 'Boom Gerson', cursoId: 'prog', paralelo: 'A' },
        { cedula: '1312789012', nombre: 'Dreemurr Toriel', cursoId: 'prog', paralelo: 'B' },
    ],
    justificaciones: [
        { cursoId: 'mat', estudianteCedula: '1301010101', fecha: '2025-10-15', motivo: 'Cita médica urgente. Adjunto certificado original del IESS.', estado: 'Pendiente' },
    ],
    historialAsistencia: [
        // Datos simulados para Reportes (Matemáticas Avanzadas - Paralelo A)
        { cedula: '1301010101', estado: 'Asistió', fecha: '2025-09-01', cursoId: 'mat', paralelo: 'A' },
        { cedula: '1301010101', estado: 'No Asistió', observacion: 'Gripe fuerte.', fecha: '2025-09-04', cursoId: 'mat', paralelo: 'A' }, 
        { cedula: '1301010101', estado: 'Justificado', observacion: 'Cita IESS aprobada.', fecha: '2025-09-05', cursoId: 'mat', paralelo: 'A' }, 
        { cedula: '1301010101', estado: 'Asistió', fecha: '2025-09-06', cursoId: 'mat', paralelo: 'A' },
        
        { cedula: '1313131313', estado: 'No Asistió', observacion: 'Problemas de bus.', fecha: '2025-09-02', cursoId: 'mat', paralelo: 'A' },
        { cedula: '1313131313', estado: 'No Asistió', fecha: '2025-09-03', cursoId: 'mat', paralelo: 'A' },
        { cedula: '1313131313', estado: 'No Asistió', fecha: '2025-09-04', cursoId: 'mat', paralelo: 'A' },
        { cedula: '1313131313', estado: 'No Asistió', fecha: '2025-09-05', cursoId: 'mat', paralelo: 'A' },
        { cedula: '1313131313', estado: 'No Asistió', fecha: '2025-09-07', cursoId: 'mat', paralelo: 'A' },
        
        { cedula: '1300112233', estado: 'No Asistió', fecha: '2025-09-03', cursoId: 'mat', paralelo: 'A' }, 
        { cedula: '1300112233', estado: 'No Asistió', fecha: '2025-09-07', cursoId: 'mat', paralelo: 'A' }, 
        
        { cedula: '1300000001', estado: 'Asistió', fecha: '2025-09-01', cursoId: 'mat', paralelo: 'A' },
        { cedula: '1305456789', estado: 'Asistió', fecha: '2025-09-01', cursoId: 'prog', paralelo: 'A' },
        { cedula: '1305456789', estado: 'Asistió', fecha: '2025-09-02', cursoId: 'prog', paralelo: 'A' },
    ],
    // Simulación de Reportes Guardados
    reportesGuardados: [
        { 
            nombre: 'REPORTE PARCIAL 1 - MAT-A', 
            cursoId: 'mat', paralelo: 'A',
            fechaGen: '2025-10-13', 
            fechaInicio: '2025-09-01', 
            fechaFin: '2025-09-15',
            // Data estática simulada para el reporte guardado (para que la visualización funcione)
            data: [{cedula: '1301010101', nombre: 'Dreemurr Asriel', faltas: 1, asistencia: '90.0%', totalClases: 10, asistencias: [{estado: 'Asistió', fecha: '2025-09-01'}, {estado: 'No Asistió', fecha: '2025-09-04'}]}, {cedula: '1313131313', nombre: 'Sans E. Skeleton', faltas: 5, asistencia: '50.0%', totalClases: 10, asistencias: [{estado: 'No Asistió', fecha: '2025-09-02'}, {estado: 'No Asistió', fecha: '2025-09-03'}]}] 
        },
        { 
            nombre: 'REPORTE AVANCE 1 - PROG-B', 
            cursoId: 'prog', paralelo: 'B',
            fechaGen: '2025-08-20', 
            fechaInicio: '2025-08-01', 
            fechaFin: '2025-08-15',
            data: null 
        },
    ]
};

// Variable global para almacenar el último reporte generado
let lastGeneratedReport = null;


document.addEventListener('DOMContentLoaded', () => {
    const userRole = localStorage.getItem('userRole');
    const userName = localStorage.getItem('userName'); 

    if (userRole !== 'docente') {
        alert('Acceso denegado. Redirigiendo al login.');
        window.location.href = 'index.html';
        return;
    }
    
    document.getElementById('docente-name-display').textContent = userName || 'Error al cargar nombre';
    document.getElementById('registro-date').value = getTodayDate(); 

    const cursoSelectRegistro = document.getElementById('registro-curso-select');
    const cursoSelectReporte = document.getElementById('reporte-curso-select');
    
    // Fechas por defecto para GENERAR reporte
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    document.getElementById('reporte-fecha-inicio').value = formatDate(oneMonthAgo);
    document.getElementById('reporte-fecha-fin').value = getTodayDate();
    
    // Fechas por defecto para VISUALIZAR reporte
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
    document.getElementById('view-search-date-start').value = formatDate(threeMonthsAgo);
    document.getElementById('view-search-date-end').value = getTodayDate();


    DOCENTE_DATA.cursos.forEach(curso => {
        const option = document.createElement('option');
        option.value = curso.id;
        option.textContent = curso.nombre;
        
        const optionReporte = option.cloneNode(true);

        cursoSelectRegistro.appendChild(option);
        cursoSelectReporte.appendChild(optionReporte);
    });

    setupTabs();
    loadRegistro();
    loadJustificacionesPendientes(true);
    
    // Cargar la tabla de reportes guardados al inicio
    renderSavedReports(DOCENTE_DATA.reportesGuardados); 
});

function setupTabs() {
    document.querySelectorAll('.tab-button').forEach(button => {
        button.addEventListener('click', (e) => {
            const targetTab = e.currentTarget.dataset.tab;

            document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));

            e.currentTarget.classList.add('active');
            document.getElementById(targetTab).classList.add('active');
            
            if (targetTab === 'reportes') {
                // Re-inicializa la vista de reportes al entrar
                document.getElementById('report-mode-select').value = 'generate';
                changeReportMode(); 
            } else if (targetTab === 'pendientes') {
                loadJustificacionesPendientes(false); 
            }
        });
    });
}

// ------------------- LÓGICA DE REGISTRO -------------------

function loadRegistro() {
    const cursoId = document.getElementById('registro-curso-select').value;
    const paralelo = document.getElementById('registro-paralelo-select').value;
    const tablaBody = document.querySelector('#registro-table tbody');
    tablaBody.innerHTML = '';
    
    const cursoNombre = DOCENTE_DATA.cursos.find(c => c.id === cursoId)?.nombre || '';
    document.getElementById('current-course-display').textContent = `${cursoNombre} - Paralelo ${paralelo}`;

    const estudiantesFiltrados = DOCENTE_DATA.estudiantes.filter(e => 
        e.cursoId === cursoId && e.paralelo === paralelo
    );

    if (estudiantesFiltrados.length === 0) {
        tablaBody.innerHTML = `<tr><td colspan="4">No hay estudiantes matriculados en este paralelo.</td></tr>`;
        return;
    }

    estudiantesFiltrados.forEach(est => {
        const row = tablaBody.insertRow();
        row.innerHTML = `
            <td>${est.cedula}</td>
            <td>${est.nombre}</td>
            <td class="status-col">
                <div class="attendance-options">
                    <input type="radio" id="asiste-${est.cedula}" name="asistencia-${est.cedula}" value="Asistió" checked>
                    <label for="asiste-${est.cedula}">Asistió</label>

                    <input type="radio" id="no-asiste-${est.cedula}" name="asistencia-${est.cedula}" value="No Asistió">
                    <label for="no-asiste-${est.cedula}">No Asistió</label>
                </div>
            </td>
            <td><input type="text" id="obs-${est.cedula}" placeholder="Notas del docente"></td>
        `;
    });
}

function saveAndAdvance() {
    const cursoId = document.getElementById('registro-curso-select').value;
    const paralelo = document.getElementById('registro-paralelo-select').value;
    const fecha = document.getElementById('registro-date').value;
    
    const estudiantesEnLista = document.querySelectorAll('#registro-table tbody tr');
    let registroSesion = [];

    estudiantesEnLista.forEach(row => {
        const cedula = row.cells[0].textContent;
        const asistencia = document.querySelector(`input[name="asistencia-${cedula}"]:checked`)?.value; 
        const observacion = document.getElementById(`obs-${cedula}`)?.value;
        
        registroSesion.push({
            cedula,
            estado: asistencia,
            observacion: observacion,
            fecha,
            cursoId,
            paralelo
        });
    });

    // Simulamos guardar la nueva asistencia en el historial
    DOCENTE_DATA.historialAsistencia.push(...registroSesion);
    
    openDocenteModal(`Asistencia del Paralelo ${paralelo} guardada correctamente (${registroSesion.length} registros).`);
    
    const paraleloSelect = document.getElementById('registro-paralelo-select');
    const currentIndex = paraleloSelect.selectedIndex;
    
    if (currentIndex < paraleloSelect.options.length - 1) {
        paraleloSelect.selectedIndex = currentIndex + 1;
        loadRegistro(); 
    } else {
        openDocenteModal("Se ha completado la asistencia para todos los paralelos del curso seleccionado. Use 'Finalizar'.");
    }
}

function finalizarRegistro() {
    openDocenteModal("Registro de asistencia para esta fecha finalizado. Puede cambiar el curso o la fecha.");
}

function regresar() {
    const paraleloSelect = document.getElementById('registro-paralelo-select');
    const currentIndex = paraleloSelect.selectedIndex;
    
    if (currentIndex > 0) {
        paraleloSelect.selectedIndex = currentIndex - 1;
        loadRegistro();
    } else {
        openDocenteModal("Ya estás en el primer paralelo.");
    }
}

// ------------------- LÓGICA DE MODOS DE REPORTE -------------------

function changeReportMode() {
    const mode = document.getElementById('report-mode-select').value;
    const generateDiv = document.getElementById('generate-filters');
    const viewDiv = document.getElementById('view-filters');
    
    // Ocultar el detalle de sesión al cambiar de modo
    document.getElementById('reporte-session-detail').style.display = 'none';
    
    if (mode === 'generate') {
        generateDiv.classList.remove('hidden');
        viewDiv.classList.add('hidden');
        // Mostrar el botón de guardar si existe un reporte generado pendiente
        document.getElementById('save-report-btn').style.display = lastGeneratedReport ? 'inline-block' : 'none';
    } else if (mode === 'view') {
        generateDiv.classList.add('hidden');
        viewDiv.classList.remove('hidden');
        // Asegurar que la lista de reportes guardados esté actualizada
        filterSavedReports(); 
    }
}

// ------------------- LÓGICA DE GENERAR REPORTE -------------------

function generateReport() {
    const cursoId = document.getElementById('reporte-curso-select').value;
    const paralelo = document.getElementById('reporte-paralelo-select').value;
    const fechaInicioStr = document.getElementById('reporte-fecha-inicio').value;
    const fechaFinStr = document.getElementById('reporte-fecha-fin').value;
    const tablaBody = document.getElementById('reporte-table-body');
    tablaBody.innerHTML = '';
    
    document.getElementById('report-title').textContent = `Reporte Acumulado: ${document.getElementById('reporte-curso-select').options[document.getElementById('reporte-curso-select').selectedIndex].text} - Paralelo ${paralelo} (${fechaInicioStr} a ${fechaFinStr})`;
    document.getElementById('reporte-session-detail').style.display = 'none'; // Ocultar detalle al generar nuevo reporte
    
    const estudiantesFiltrados = DOCENTE_DATA.estudiantes.filter(e => 
        e.cursoId === cursoId && e.paralelo === paralelo
    );
    
    if (estudiantesFiltrados.length === 0) {
        tablaBody.innerHTML = `<tr><td colspan="6">No hay estudiantes matriculados en este paralelo para reportar.</td></tr>`;
        lastGeneratedReport = null;
        document.getElementById('save-report-btn').style.display = 'none';
        return;
    }

    const reportData = estudiantesFiltrados.map(est => {
        const asistenciasEstudiante = DOCENTE_DATA.historialAsistencia.filter(a => 
            a.cedula === est.cedula && 
            a.cursoId === cursoId && 
            a.paralelo === paralelo && 
            a.fecha >= fechaInicioStr && 
            a.fecha <= fechaFinStr
        );
        
        const totalClases = asistenciasEstudiante.length;
        let asistioCount = 0;
        let faltaCount = 0;
        
        asistenciasEstudiante.forEach(a => {
            if (a.estado === 'Asistió' || a.estado === 'Justificado') {
                asistioCount++;
            } else if (a.estado === 'No Asistió' || a.estado === 'Pendiente de Revisión') {
                faltaCount++;
            }
        });
        
        const percent = totalClases > 0 ? (asistioCount / totalClases) * 100 : 100;
        
        let riesgo = 'OK';
        let riesgoClass = 'risk-ok';
        
        if (percent < 70) {
            riesgo = 'CRÍTICO';
            riesgoClass = 'risk-critical';
        } else if (percent < 80) {
            riesgo = 'ALERTA';
            riesgoClass = 'risk-alert';
        }

        return {
            cedula: est.cedula,
            nombre: est.nombre,
            faltas: faltaCount,
            asistencia: percent.toFixed(1) + '%',
            riesgo: `<span class="${riesgoClass}">${riesgo}</span>`,
            totalClases: totalClases,
            // Guardar el detalle de asistencias para el botón 'Ver'
            asistencias: asistenciasEstudiante 
        };
    }).sort((a, b) => parseFloat(a.asistencia) - parseFloat(b.asistencia)); 

    reportData.forEach(data => {
        const row = tablaBody.insertRow();
        row.innerHTML = `
            <td>${data.cedula}</td>
            <td>${data.nombre}</td>
            <td>${data.faltas} / ${data.totalClases}</td>
            <td>${data.asistencia}</td>
            <td>${data.riesgo}</td>
            <td><button class="btn-secondary small-btn" onclick="showStudentDetailFromGenerated('${data.cedula}', '${data.nombre}')">Ver</button></td>
        `;
    });
    
    if (reportData.every(d => d.totalClases === 0) && estudiantesFiltrados.length > 0) {
         tablaBody.innerHTML = `<tr><td colspan="6">No se encontraron registros de asistencia para el período y curso seleccionados.</td></tr>`;
         lastGeneratedReport = null;
    } else {
        // Almacenar el reporte generado para poder guardarlo
        lastGeneratedReport = {
            cursoId, 
            paralelo, 
            fechaInicio: fechaInicioStr, 
            fechaFin: fechaFinStr, 
            reportData // Guardamos toda la data detallada
        };
    }
    
    // Mostrar el botón de guardar si se generó algo
    document.getElementById('save-report-btn').style.display = lastGeneratedReport ? 'inline-block' : 'none';
}

function showStudentDetailFromGenerated(cedula, nombre) {
    if (!lastGeneratedReport) return;
    
    const studentData = lastGeneratedReport.reportData.find(d => d.cedula === cedula);
    
    if (!studentData || !studentData.asistencias) {
        openDocenteModal('No se encontró detalle de asistencia para este estudiante en el reporte generado.', 'Error de Detalle');
        return;
    }
    
    const asistenciasEstudiante = studentData.asistencias;
    const sessionBody = document.getElementById('session-table-body');
    sessionBody.innerHTML = '';
    
    document.getElementById('reporte-session-detail').style.display = 'block';
    document.querySelector('#reporte-session-detail .Subtema').textContent = `Detalle de Asistencias de ${nombre} (${lastGeneratedReport.fechaInicio} a ${lastGeneratedReport.fechaFin})`;

    asistenciasEstudiante.sort((a, b) => new Date(a.fecha) - new Date(b.fecha)); 
    
    asistenciasEstudiante.forEach(a => {
        let estadoClass = '';
        if (a.estado === 'Asistió') estadoClass = 'status-asistio';
        else if (a.estado === 'Justificado') estadoClass = 'status-justificado';
        else if (a.estado === 'No Asistió') estadoClass = 'status-no-asistio';
        else if (a.estado === 'Pendiente de Revisión') estadoClass = 'status-pendiente';

        const row = sessionBody.insertRow();
        row.innerHTML = `
            <td>${a.fecha}</td>
            <td class="${estadoClass}">${a.estado}</td>
            <td>${a.observacion || 'N/A'}</td>
        `;
    });
}


function saveGeneratedReport() {
    if (!lastGeneratedReport) {
        openDocenteModal('Debe generar un reporte primero para poder guardarlo.', 'Error de Guardado');
        return;
    }
    
    const courseName = DOCENTE_DATA.cursos.find(c => c.id === lastGeneratedReport.cursoId)?.nombre || lastGeneratedReport.cursoId;
    
    const reportName = prompt(`Ingrese un nombre para el reporte (${courseName} - ${lastGeneratedReport.paralelo}):`, `REPORTE ACUMULADO ${courseName.toUpperCase().split(' ')[0]}-${lastGeneratedReport.paralelo} ${getTodayDate()}`);

    if (reportName) {
        const newReport = {
            nombre: reportName.substring(0, 50),
            cursoId: lastGeneratedReport.cursoId, 
            paralelo: lastGeneratedReport.paralelo,
            fechaGen: getTodayDate(), 
            fechaInicio: lastGeneratedReport.fechaInicio, 
            fechaFin: lastGeneratedReport.fechaFin,
            data: lastGeneratedReport.reportData 
        };
        
        DOCENTE_DATA.reportesGuardados.push(newReport);
        openDocenteModal(`Reporte "${newReport.nombre}" guardado exitosamente.`, 'Guardado Exitoso');
        
        lastGeneratedReport = null;
        document.getElementById('save-report-btn').style.display = 'none';
        document.getElementById('reporte-table-body').innerHTML = `<tr><td colspan="6">Reporte guardado. Genere uno nuevo o cambie al modo "Visualizar Reportes Guardados".</td></tr>`;
        document.getElementById('reporte-session-detail').style.display = 'none';
        
        renderSavedReports(DOCENTE_DATA.reportesGuardados);
    }
}

// ------------------- LÓGICA DE VISUALIZAR REPORTES -------------------

function filterSavedReports() {
    const searchName = document.getElementById('view-search-name').value.toLowerCase();
    const startDate = document.getElementById('view-search-date-start').value;
    const endDate = document.getElementById('view-search-date-end').value;
    
    const filteredReports = DOCENTE_DATA.reportesGuardados.filter(report => {
        const matchesName = report.nombre.toLowerCase().includes(searchName);
        const matchesDateStart = !startDate || report.fechaGen >= startDate;
        const matchesDateEnd = !endDate || report.fechaGen <= endDate;
        
        return matchesName && matchesDateStart && matchesDateEnd;
    });

    renderSavedReports(filteredReports);
}

function renderSavedReports(reports) {
    const tablaBody = document.getElementById('saved-reports-table-body');
    tablaBody.innerHTML = '';
    
    if (reports.length === 0) {
        tablaBody.innerHTML = `<tr><td colspan="5">No se encontraron reportes guardados que coincidan con los filtros.</td></tr>`;
        return;
    }
    
    reports.forEach(r => {
        const cursoNombre = DOCENTE_DATA.cursos.find(c => c.id === r.cursoId)?.nombre || r.cursoId;
        const row = tablaBody.insertRow();
        row.innerHTML = `
            <td>${r.nombre}</td>
            <td>${cursoNombre} - Paralelo ${r.paralelo}</td>
            <td>${r.fechaGen}</td>
            <td>${r.fechaInicio} a ${r.fechaFin}</td>
            <td>
                <button class="btn-primary small-btn" onclick="viewSavedReportDetail('${r.nombre}')">Visualizar Detalle</button>
            </td>
        `;
    });
}

function viewSavedReportDetail(reportName) {
    const report = DOCENTE_DATA.reportesGuardados.find(r => r.nombre === reportName);
    
    if (!report) {
        openDocenteModal('Error al cargar el reporte guardado.', 'Error');
        return;
    }
    
    if (!report.data) {
         openDocenteModal('El reporte no contiene datos detallados de estudiantes.', 'Reporte sin Datos');
         return;
    }
    
    // Cambiamos al modo "Generar" y cargamos la data estática del reporte guardado
    document.getElementById('report-mode-select').value = 'generate';
    changeReportMode(); 
    document.getElementById('save-report-btn').style.display = 'none'; // No se puede guardar un reporte ya guardado

    const tablaBody = document.getElementById('reporte-table-body');
    tablaBody.innerHTML = '';
    
    document.getElementById('report-title').textContent = `Visualizando Reporte Guardado: ${report.nombre} (${report.fechaInicio} a ${report.fechaFin})`;
    lastGeneratedReport = report; // Cargar la data del reporte guardado en la variable de trabajo

    report.data.forEach(data => {
        const row = tablaBody.insertRow();
        row.innerHTML = `
            <td>${data.cedula}</td>
            <td>${data.nombre}</td>
            <td>${data.faltas} / ${data.totalClases}</td>
            <td>${data.asistencia}</td>
            <td>${data.riesgo || 'N/A'}</td>
            <td><button class="btn-secondary small-btn" onclick="showStudentDetailFromGenerated('${data.cedula}', '${data.nombre}')">Ver</button></td>
        `;
    });

    openDocenteModal(`Cargando reporte **"${report.nombre}"** en la interfaz de generación para su visualización.`, 'Visualización de Reporte');
}


// ------------------- LÓGICA DE UTILIDAD -------------------

function loadJustificacionesPendientes(onlyCount = false) {
    const pendientesFiltrados = DOCENTE_DATA.justificaciones.filter(j => j.estado === 'Pendiente');
    
    document.getElementById('pending-count').textContent = pendientesFiltrados.length;
    
    if (onlyCount) return; 

    const pendientesDiv = document.getElementById('pendientes');
    let tablaBody = document.getElementById('pendientes-tbody');

    if (!tablaBody) {
        const tablaHTML = `
            <table id="pendientes-table" class="data-table">
                <thead>
                    <tr>
                        <th>Fecha Falta</th>
                        <th>Estudiante</th>
                        <th>Curso</th>
                        <th>Motivo</th>
                        <th>Acción</th>
                    </tr>
                </thead>
                <tbody id="pendientes-tbody"></tbody>
            </table>
        `;
        if(pendientesDiv.querySelector('p')) pendientesDiv.querySelector('p').remove();
        pendientesDiv.innerHTML = tablaHTML;
        tablaBody = document.getElementById('pendientes-tbody');
    }
    
    tablaBody.innerHTML = '';

    if (pendientesFiltrados.length === 0) {
        tablaBody.innerHTML = `<tr><td colspan="5">No hay solicitudes de justificación pendientes.</td></tr>`;
        return;
    }

    pendientesFiltrados.forEach(j => {
        const est = DOCENTE_DATA.estudiantes.find(e => e.cedula === j.estudianteCedula);
        const curso = DOCENTE_DATA.cursos.find(c => c.id === j.cursoId)?.nombre;
        
        const row = tablaBody.insertRow();
        row.innerHTML = `
            <td>${j.fecha}</td>
            <td>${est ? est.nombre : 'N/A'}</td>
            <td>${curso}</td>
            <td><button class="btn-secondary small-btn" onclick="openDocenteModal('${j.motivo.replace(/'/g, "\\'")}', 'Motivo de Justificación')">Ver Motivo</button></td>
            <td>
                <button class="btn-primary small-btn" onclick="aprobarJustificacion('${j.fecha}', '${j.estudianteCedula}')">Aprobar</button>
                <button class="btn-logout small-btn" onclick="rechazarJustificacion('${j.fecha}', '${j.estudianteCedula}')">Rechazar</button>
            </td>
        `;
    });
}

function aprobarJustificacion(fecha, cedula) {
    const index = DOCENTE_DATA.justificaciones.findIndex(j => j.fecha === fecha && j.estudianteCedula === cedula);
    if (index !== -1) {
        DOCENTE_DATA.justificaciones[index].estado = 'Aprobada';
        openDocenteModal(`Justificación APROBADA para ${cedula} en la falta del ${fecha}. El sistema actualizará el estado del estudiante.`);
        loadJustificacionesPendientes(false); 
    }
}

function rechazarJustificacion(fecha, cedula) {
    const index = DOCENTE_DATA.justificaciones.findIndex(j => j.fecha === fecha && j.estudianteCedula === cedula);
    if (index !== -1) {
        DOCENTE_DATA.justificaciones[index].estado = 'Rechazada';
        openDocenteModal(`Justificación RECHAZADA para ${cedula} en la falta del ${fecha}.`);
        loadJustificacionesPendientes(false); 
    }
}

function openDocenteModal(message, title = 'Notificación del Sistema') {
    document.getElementById('docente-modal-message').innerHTML = message;
    document.querySelector('#success-modal-docente h3').textContent = title;
    document.getElementById('success-modal-docente').style.display = 'block';
}

function closeDocenteModal() {
    document.getElementById('success-modal-docente').style.display = 'none';
}

function logout() {
    localStorage.removeItem('userRole');
    localStorage.removeItem('userName');
    localStorage.removeItem('userCorreo');
    window.location.href = 'index.html';
}