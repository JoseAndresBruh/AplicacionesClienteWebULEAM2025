const getTodayDate = () => new Date().toISOString().split('T')[0];
const formatDate = (date) => {
    if (typeof date === 'string') date = new Date(date);
    return date.toISOString().split('T')[0];
};


const loadHistorialAsistencia = () => {
    const storedData = localStorage.getItem('historialAsistencia');
    if (storedData) {
        return JSON.parse(storedData);
    }
    return [
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
    ];
};

const saveHistorialAsistencia = (historial) => {
    localStorage.setItem('historialAsistencia', JSON.stringify(historial));
};

const loadReportesGuardados = () => {
    const storedReports = localStorage.getItem('reportesGuardados');
    if (storedReports) {
        return JSON.parse(storedReports);
    }
    return [
        { 
            nombre: 'REPORTE PARCIAL 1 - MAT-A', 
            cursoId: 'mat', paralelo: 'A',
            fechaGen: '2025-10-13', 
            fechaInicio: '2025-09-01', 
            fechaFin: '2025-09-15',
            data: [{cedula: '1301010101', nombre: 'Dreemurr Asriel', faltas: 1, totalClases: 10, asistencias: [{estado: 'Asistió', fecha: '2025-09-01'}, {estado: 'No Asistió', fecha: '2025-09-04'}]}, {cedula: '1313131313', nombre: 'Sans E. Skeleton', faltas: 5, totalClases: 10, asistencias: [{estado: 'No Asistió', fecha: '2025-09-02'}, {estado: 'No Asistió', fecha: '2025-09-03'}]}] 
        },
    ];
};

const saveReportesGuardados = (reports) => {
    localStorage.setItem('reportesGuardados', JSON.stringify(reports));
};

const loadJustificacionesGlobal = () => {
    const storedJustificaciones = localStorage.getItem('justificacionesGlobal');
    if (storedJustificaciones) {
        return JSON.parse(storedJustificaciones);
    }
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


const DOCENTE_DATA = {
    cursos: [
        { id: 'mat', nombre: 'Matemáticas Avanzadas', paralelos: ['A', 'B'] },
        { id: 'prog', nombre: 'Programación Web I', paralelos: ['A', 'B', 'C'] },
    ],
    estudiantes: [
        { cedula: '1301010101', nombre: 'José Loor', cursoId: 'mat', paralelo: 'A' },
        { cedula: '1313131313', nombre: 'Sans E. Skeleton', cursoId: 'mat', paralelo: 'A' },
        { cedula: '1300112233', nombre: 'Gómez Ana Sofía', cursoId: 'mat', paralelo: 'A' },
        { cedula: '1300000001', nombre: 'Ramírez José P.', cursoId: 'mat', paralelo: 'A' },
        { cedula: '1300000002', nombre: 'Vásquez María T.', cursoId: 'mat', paralelo: 'A' },
        { cedula: '1300445566', nombre: 'Pérez Carlos A.', cursoId: 'mat', paralelo: 'B' },
        { cedula: '1300778899', nombre: 'Rodas María F.', cursoId: 'mat', paralelo: 'B' },
        { cedula: '0909090909', nombre: 'Windings Goster', cursoId: 'prog', paralelo: 'A' },
        { cedula: '1305456789', nombre: 'Boom Gerson', cursoId: 'prog', paralelo: 'A' },
        { cedula: '1312789012', nombre: 'Dreemurr Toriel', cursoId: 'prog', paralelo: 'B' },
        { cedula: '1399999999', nombre: 'Dreemurr Asriel', cursoId: 'prog', paralelo: 'A' },
    ],
    historialAsistencia: loadHistorialAsistencia(),
    reportesGuardados: loadReportesGuardados(),
    justificaciones: loadJustificacionesGlobal(), 
};

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
    
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    document.getElementById('reporte-fecha-inicio').value = formatDate(oneMonthAgo);
    document.getElementById('reporte-fecha-fin').value = getTodayDate();
    
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
                document.getElementById('report-mode-select').value = 'generate';
                changeReportMode(); 
            } else if (targetTab === 'pendientes') {
                loadJustificacionesPendientes(false); 
            }
        });
    });
}


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

    DOCENTE_DATA.historialAsistencia.push(...registroSesion);

    saveHistorialAsistencia(DOCENTE_DATA.historialAsistencia);
    
    openDocenteModal(`Asistencia del Paralelo ${paralelo} guardada correctamente (${registroSesion.length} registros).`);
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


function changeReportMode() {
    const mode = document.getElementById('report-mode-select').value;
    const generateDiv = document.getElementById('generate-filters');
    const viewDiv = document.getElementById('view-filters');
    
    document.getElementById('reporte-session-detail').style.display = 'none';
    
    if (mode === 'generate') {
        generateDiv.classList.remove('hidden');
        viewDiv.classList.add('hidden');
        document.getElementById('save-report-btn').style.display = lastGeneratedReport ? 'inline-block' : 'none';
    } else if (mode === 'view') {
        generateDiv.classList.add('hidden');
        viewDiv.classList.remove('hidden');
        filterSavedReports();
    }
}


function generateReport() {
    const cursoSelect = document.getElementById('reporte-curso-select');
    const cursoId = cursoSelect.value;
    const paralelo = document.getElementById('reporte-paralelo-select').value;
    const fechaInicioStr = document.getElementById('reporte-fecha-inicio').value;
    const fechaFinStr = document.getElementById('reporte-fecha-fin').value;
    const tablaBody = document.getElementById('reporte-table-body');
    
    tablaBody.innerHTML = '';
    document.getElementById('reporte-session-detail').style.display = 'none';
    lastGeneratedReport = null;
    document.getElementById('save-report-btn').style.display = 'none';

    const cursoNombre = cursoSelect.options[cursoSelect.selectedIndex].text;
    const reportTitle = `Reporte Acumulado: ${cursoNombre} - Paralelo ${paralelo} (${fechaInicioStr} a ${fechaFinStr})`;
    document.getElementById('report-title').textContent = reportTitle;

    const estudiantesFiltrados = DOCENTE_DATA.estudiantes.filter(e => 
        e.cursoId === cursoId && e.paralelo === paralelo 
    );

    if (estudiantesFiltrados.length === 0) {
        tablaBody.innerHTML = `<tr><td colspan="5">No hay estudiantes matriculados en este paralelo para reportar.</td></tr>`;
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

        const totalClases = new Set(asistenciasEstudiante.map(a => a.fecha)).size;
        let faltaCount = 0;

        asistenciasEstudiante.forEach(a => {
            if (a.estado === 'No Asistió') {
                faltaCount++;
            }
        });

        return {
            cedula: est.cedula,
            nombre: est.nombre,
            faltas: faltaCount,
            totalClases: totalClases,
            asistencias: asistenciasEstudiante.sort((a, b) => new Date(a.fecha) - new Date(b.fecha))
        };
    }).filter(data => data.totalClases > 0); 

    if (reportData.length === 0) {
        tablaBody.innerHTML = `<tr><td colspan="5">¡ATENCIÓN! No se encontraron registros de asistencia en el rango de fechas seleccionado para este paralelo.</td></tr>`;
        openDocenteModal("No se encontraron registros de asistencia en el rango de fechas seleccionado para este curso/paralelo.", "Advertencia de Reporte");
        return;
    }


    reportData.forEach(data => {
        const row = tablaBody.insertRow();
        row.innerHTML = `
            <td>${data.cedula}</td>
            <td>${data.nombre}</td>
            <td>${data.totalClases}</td>
            <td>${data.faltas}</td>
            <td><button class="btn-secondary btn-small" onclick="viewReportDetails('${data.cedula}')">Detalle</button></td>
        `;
    });

    lastGeneratedReport = {
        nombre: reportTitle,
        cursoId, paralelo,
        fechaGen: getTodayDate(),
        fechaInicio: fechaInicioStr,
        fechaFin: fechaFinStr,
        data: reportData,
    };
    
    openDocenteModal(`Reporte generado con éxito. ${reportData.length} estudiantes con registros en el rango.`);
    document.getElementById('save-report-btn').style.display = 'inline-block';
}

function saveReport() {
    if (!lastGeneratedReport) {
        openDocenteModal("No hay un reporte reciente generado para guardar.", "Error al Guardar");
        return;
    }
    
    const reportName = prompt("Ingrese un nombre descriptivo para guardar este reporte (ej: PARCIAL 1 - MAT-A):", lastGeneratedReport.nombre);

    if (!reportName || reportName.trim() === "") {
        openDocenteModal("El reporte no fue guardado. Debe ingresar un nombre.", "Guardado Cancelado");
        return;
    }

    lastGeneratedReport.nombre = reportName;

    DOCENTE_DATA.reportesGuardados.unshift(lastGeneratedReport);
    
    saveReportesGuardados(DOCENTE_DATA.reportesGuardados);

    lastGeneratedReport = null;
    document.getElementById('save-report-btn').style.display = 'none';
    
    if (document.getElementById('report-mode-select').value === 'view') {
        filterSavedReports();
    }
    
    openDocenteModal(`Reporte '${reportName}' guardado exitosamente.`);
}


function renderSavedReports(reports) {
    const tableBody = document.getElementById('saved-reports-table-body');
    tableBody.innerHTML = '';

    if (reports.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="5">No hay reportes guardados.</td></tr>`;
        return;
    }

    reports.forEach((report, index) => {
        const row = tableBody.insertRow();
        row.dataset.index = index; 
        row.innerHTML = `
            <td>${report.nombre}</td>
            <td>${DOCENTE_DATA.cursos.find(c => c.id === report.cursoId)?.nombre} - ${report.paralelo}</td>
            <td>${report.fechaInicio} a ${report.fechaFin}</td>
            <td>${report.fechaGen}</td>
            <td><button class="btn-primary btn-small" onclick="viewSavedReportDetails(${index})">Ver</button></td>
        `;
    });
}

function filterSavedReports() {
    const searchName = document.getElementById('view-search-name').value.toLowerCase();
    const startDateStr = document.getElementById('view-search-date-start').value;
    const endDateStr = document.getElementById('view-search-date-end').value;

    const filteredReports = DOCENTE_DATA.reportesGuardados.filter(report => {
        const nameMatch = report.nombre.toLowerCase().includes(searchName);
        
        const dateStartMatch = !startDateStr || report.fechaGen >= startDateStr;
        const dateEndMatch = !endDateStr || report.fechaGen <= endDateStr;
        
        return nameMatch && dateStartMatch && dateEndMatch;
    });

    renderSavedReports(filteredReports);
}

function viewSavedReportDetails(index) {
    const report = DOCENTE_DATA.reportesGuardados[index];
    if (!report) return;

    lastGeneratedReport = report;

    document.getElementById('report-mode-select').value = 'generate';
    changeReportMode(); 

    document.getElementById('reporte-curso-select').value = report.cursoId;
    document.getElementById('reporte-paralelo-select').value = report.paralelo;
    document.getElementById('reporte-fecha-inicio').value = report.fechaInicio;
    document.getElementById('reporte-fecha-fin').value = report.fechaFin;

    document.getElementById('report-title').textContent = report.nombre;

    const tablaBody = document.getElementById('reporte-table-body');
    tablaBody.innerHTML = '';
    
    if (!report.data || report.data.length === 0) {
        tablaBody.innerHTML = `<tr><td colspan="5">No se encontraron datos de estudiantes en el reporte guardado.</td></tr>`;
        return;
    }

    report.data.forEach(data => {
        const row = tablaBody.insertRow();
        row.innerHTML = `
            <td>${data.cedula}</td>
            <td>${data.nombre}</td>
            <td>${data.totalClases || '-'}</td>
            <td>${data.faltas || '-'}</td>
            <td><button class="btn-secondary btn-small" onclick="viewReportDetails('${data.cedula}')">Detalle</button></td>
        `;
    });

    openDocenteModal(`Visualizando reporte guardado: ${report.nombre}`);
}


function viewReportDetails(cedula) {
    if (!lastGeneratedReport || !lastGeneratedReport.data) {
        openDocenteModal("No hay un reporte activo para ver el detalle.", "Error");
        return;
    }

    const estudianteData = lastGeneratedReport.data.find(d => d.cedula === cedula);
    if (!estudianteData || !estudianteData.asistencias) {
        openDocenteModal("No se encontraron asistencias detalladas para este estudiante.", "Error");
        return;
    }

    const detailDiv = document.getElementById('reporte-session-detail');
    const detailBody = document.getElementById('session-table-body');
    detailBody.innerHTML = '';

    document.getElementById('session-detail-title').textContent = `Detalle de Asistencias de ${estudianteData.nombre} (${estudianteData.cedula})`;

    estudianteData.asistencias.forEach(asistencia => {
        const row = detailBody.insertRow();
        let statusClass = '';
        if (asistencia.estado === 'Asistió') statusClass = 'status-asistio';
        else if (asistencia.estado === 'No Asistió') statusClass = 'status-no-asistio';
        else if (asistencia.estado === 'Justificado') statusClass = 'status-justificado';
        
        row.innerHTML = `
            <td>${asistencia.fecha}</td>
            <td class="${statusClass}">${asistencia.estado}</td>
            <td>${asistencia.observacion || 'N/A'}</td>
        `;
    });

    detailDiv.style.display = 'block';
    detailDiv.scrollIntoView({ behavior: 'smooth' });
}



function loadJustificacionesPendientes(initialLoad) {
    DOCENTE_DATA.justificaciones = loadJustificacionesGlobal(); 
    const justificacionesPendientes = DOCENTE_DATA.justificaciones.filter(j => j.estado === 'Pendiente');
    const tableBody = document.getElementById('pendientes-table-body');
    const pendingCountSpan = document.getElementById('pending-count');
    
    if (pendingCountSpan) {
        pendingCountSpan.textContent = justificacionesPendientes.length;
    }
    
    if (initialLoad) return; 

    tableBody.innerHTML = '';
    
    if (justificacionesPendientes.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="5">No hay solicitudes de justificación pendientes de revisión.</td></tr>`;
        return;
    }

    justificacionesPendientes.forEach(just => {
        const row = tableBody.insertRow();
        const estudiante = DOCENTE_DATA.estudiantes.find(e => e.cedula === just.estudianteCedula);
        const cursoNombre = DOCENTE_DATA.cursos.find(c => c.id === just.cursoId)?.nombre;
        
        const adjuntoHtml = just.adjuntoUrl 
            ? `<a href="${just.adjuntoUrl}" target="_blank" class="status-justificado" title="Ver archivo adjunto"><i class="fas fa-file-alt"></i> Adjunto</a>` 
            : 'No Adjuntó';
        
        row.innerHTML = `
            <td>${just.fecha}</td>
            <td>${estudiante?.nombre || just.estudianteCedula}</td>
            <td>${cursoNombre || just.cursoId}</td>
            <td>${just.motivo} (${adjuntoHtml})</td>
            <td class="action-buttons-col">
                <button class="btn-success btn-small" onclick="aprobarJustificacion('${just.fecha}', '${just.estudianteCedula}', '${just.cursoId}')">Aprobar</button>
                <button class="btn-danger btn-small" onclick="rechazarJustificacion('${just.fecha}', '${just.estudianteCedula}', '${just.cursoId}')">Rechazar</button>
            </td>
        `;
    });
}

function aprobarJustificacion(fecha, cedula, cursoId) {
    const index = DOCENTE_DATA.justificaciones.findIndex(j => 
        j.fecha === fecha && j.estudianteCedula === cedula && j.cursoId === cursoId
    );
    if (index !== -1) {
        DOCENTE_DATA.justificaciones[index].estado = 'Aprobada';
        
        const asistenciaIndex = DOCENTE_DATA.historialAsistencia.findIndex(a => 
            a.fecha === fecha && a.cedula === cedula && a.estado === 'No Asistió' && a.cursoId === cursoId
        );

        if (asistenciaIndex !== -1) {
            DOCENTE_DATA.historialAsistencia[asistenciaIndex].estado = 'Justificado';
            saveHistorialAsistencia(DOCENTE_DATA.historialAsistencia);
        }
        
        saveJustificacionesGlobal(DOCENTE_DATA.justificaciones); 

        openDocenteModal(`Justificación APROBADA para ${cedula} en la falta del ${fecha}. El sistema actualizó la asistencia.`);
        loadJustificacionesPendientes(false); 
    }
}

function rechazarJustificacion(fecha, cedula, cursoId) {
    const index = DOCENTE_DATA.justificaciones.findIndex(j => 
        j.fecha === fecha && j.estudianteCedula === cedula && j.cursoId === cursoId
    );
    if (index !== -1) {
        DOCENTE_DATA.justificaciones[index].estado = 'Rechazada';
        
        saveJustificacionesGlobal(DOCENTE_DATA.justificaciones);

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

window.onclick = function(event) {
    const modalDocente = document.getElementById('success-modal-docente');

    if (event.target == modalDocente) {
        modalDocente.style.display = "none";
    }
}