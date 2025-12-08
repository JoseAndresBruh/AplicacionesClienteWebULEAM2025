// =============================================================================
//  GESTIÓN DE DATOS Y LÓGICA DOCENTE (COMPLETO)
// =============================================================================

let DOCENTE_DATA = null;
let CONFIG_GLOBAL = {};
let lastGeneratedReport = null;

// Funciones de utilidad para fechas
const getTodayDate = () => new Date().toISOString().split('T')[0];
const formatDate = (date) => {
    if (typeof date === 'string') date = new Date(date);
    return date.toISOString().split('T')[0];
};

// --- 1. Inicialización ---
document.addEventListener('DOMContentLoaded', () => {
    const userRole = localStorage.getItem('userRole');
    const userName = localStorage.getItem('userName'); 

    if (userRole !== 'docente') {
        alert('Acceso denegado. Redirigiendo al login.');
        window.location.href = 'index.html';
        return;
    }
    
    document.getElementById('docente-name-display').textContent = userName || 'Docente';
    document.getElementById('registro-date').value = getTodayDate(); 

    try {
        loadConfigurationXML(); 
        loadDocenteData();      
        initializeInterface();
    } catch (error) {
        console.error("Error crítico:", error);
        alert("Error inicializando los datos. Revisa la consola.");
    }
});

// --- 2. Carga de Datos ---

function loadConfigurationXML() {
    if (typeof GLOBAL_CONFIG_XML === 'undefined') {
        console.warn("GLOBAL_CONFIG_XML no encontrado. Usando defaults.");
        CONFIG_GLOBAL = { UMBRAL_RIESGO: 30, PLAZO_JUSTIFICACION: 7 };
        return;
    }

    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(GLOBAL_CONFIG_XML, "text/xml");

    const umbral = xmlDoc.getElementsByTagName('umbral_riesgo')[0]?.getAttribute('porcentaje') || 30;
    const plazo = xmlDoc.getElementsByTagName('plazo_justificacion')[0]?.getAttribute('dias') || 7;
    
    CONFIG_GLOBAL = {
        UMBRAL_RIESGO: parseInt(umbral),
        PLAZO_JUSTIFICACION: parseInt(plazo)
    };
    console.log("Config XML:", CONFIG_GLOBAL);
}

function loadDocenteData() {
    const storedData = localStorage.getItem('DOCENTE_DATA_PERSIST');
    if (storedData) {
        try {
            DOCENTE_DATA = JSON.parse(storedData);
            console.log("Datos desde LocalStorage.");
        } catch (e) {
            loadFromInitialDB();
        }
    } else {
        loadFromInitialDB();
    }
}

function loadFromInitialDB() {
    if (typeof DOCENTE_INITIAL_DB === 'undefined') {
        alert("Error: db_docente.js no cargado.");
        return;
    }
    DOCENTE_DATA = JSON.parse(JSON.stringify(DOCENTE_INITIAL_DB));
    saveDataToLocal();
    console.log("Datos iniciales cargados.");
}

function saveDataToLocal() {
    if (DOCENTE_DATA) {
        localStorage.setItem('DOCENTE_DATA_PERSIST', JSON.stringify(DOCENTE_DATA));
    }
}

// --- 3. Interfaz ---

function initializeInterface() {
    const cursoSelectRegistro = document.getElementById('registro-curso-select');
    const cursoSelectReporte = document.getElementById('reporte-curso-select');
    
    // Fechas reporte
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    document.getElementById('reporte-fecha-inicio').value = formatDate(oneMonthAgo);
    document.getElementById('reporte-fecha-fin').value = getTodayDate();
    
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
    document.getElementById('view-search-date-start').value = formatDate(threeMonthsAgo);
    document.getElementById('view-search-date-end').value = getTodayDate();

    // Llenar selects
    if (DOCENTE_DATA && DOCENTE_DATA.cursos) {
        DOCENTE_DATA.cursos.forEach(curso => {
            const option = document.createElement('option');
            option.value = curso.id;
            option.textContent = curso.nombre;
            cursoSelectRegistro.appendChild(option);
            
            const optionReporte = document.createElement('option');
            optionReporte.value = curso.id;
            optionReporte.textContent = curso.nombre;
            cursoSelectReporte.appendChild(optionReporte);
        });
    }

    setupTabs();
    loadRegistro();
    loadJustificacionesPendientes(true);
    
    if (DOCENTE_DATA.reportesGuardados) {
        renderSavedReports(DOCENTE_DATA.reportesGuardados);
    }
}

// --- Lógica de Negocio ---

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

// ... Registro ...
function loadRegistro() {
    const cursoSelect = document.getElementById('registro-curso-select');
    const paraleloSelect = document.getElementById('registro-paralelo-select');
    const tablaBody = document.querySelector('#registro-table tbody');
    
    if (!cursoSelect || !paraleloSelect) return;

    const cursoId = cursoSelect.value;
    const paralelo = paraleloSelect.value;
    tablaBody.innerHTML = '';
    
    const cursoNombre = DOCENTE_DATA.cursos.find(c => c.id === cursoId)?.nombre || '';
    document.getElementById('current-course-display').textContent = `${cursoNombre} - Paralelo ${paralelo}`;

    const estudiantesFiltrados = DOCENTE_DATA.estudiantes.filter(e => 
        e.cursoId === cursoId && e.paralelo === paralelo
    );

    if (estudiantesFiltrados.length === 0) {
        tablaBody.innerHTML = `<tr><td colspan="4">No hay estudiantes matriculados.</td></tr>`;
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
            <td><input type="text" id="obs-${est.cedula}" placeholder="Notas"></td>
        `;
    });
}

function saveAndAdvance() {
    const cursoId = document.getElementById('registro-curso-select').value;
    const paralelo = document.getElementById('registro-paralelo-select').value;
    const fecha = document.getElementById('registro-date').value;
    
    const estudiantesEnLista = document.querySelectorAll('#registro-table tbody tr');
    let registroSesion = [];

    if (estudiantesEnLista.length === 0 || estudiantesEnLista[0].cells.length < 2) {
        openDocenteModal("No hay estudiantes para guardar.");
        return;
    }

    estudiantesEnLista.forEach(row => {
        const cedula = row.cells[0].textContent;
        const asistencia = document.querySelector(`input[name="asistencia-${cedula}"]:checked`)?.value || 'Asistió';
        const observacion = document.getElementById(`obs-${cedula}`)?.value || '';
        
        registroSesion.push({ cedula, estado: asistencia, observacion, fecha, cursoId, paralelo });
    });

    DOCENTE_DATA.historialAsistencia.push(...registroSesion);
    saveDataToLocal();
    
    openDocenteModal(`Asistencia guardada (${registroSesion.length} registros).`);
    
    const paraleloSelect = document.getElementById('registro-paralelo-select');
    if (paraleloSelect.selectedIndex < paraleloSelect.options.length - 1) {
        paraleloSelect.selectedIndex += 1;
        loadRegistro(); 
    } else {
        openDocenteModal("Asistencia completada. Use 'Finalizar'.");
    }
}

function finalizarRegistro() { openDocenteModal("Registro finalizado."); }
function regresar() {
    const ps = document.getElementById('registro-paralelo-select');
    if (ps.selectedIndex > 0) { ps.selectedIndex--; loadRegistro(); }
    else openDocenteModal("Primer paralelo.");
}

// ... Reportes ...
function changeReportMode() {
    const mode = document.getElementById('report-mode-select').value;
    const genDiv = document.getElementById('generate-filters');
    const viewDiv = document.getElementById('view-filters');
    document.getElementById('reporte-session-detail').style.display = 'none';
    
    if (mode === 'generate') {
        genDiv.classList.remove('hidden'); viewDiv.classList.add('hidden');
        document.getElementById('save-report-btn').style.display = lastGeneratedReport ? 'inline-block' : 'none';
    } else {
        genDiv.classList.add('hidden'); viewDiv.classList.remove('hidden');
        filterSavedReports();
    }
}

function generateReport() {
    const cursoId = document.getElementById('reporte-curso-select').value;
    const paralelo = document.getElementById('reporte-paralelo-select').value;
    const fechaInicioStr = document.getElementById('reporte-fecha-inicio').value;
    const fechaFinStr = document.getElementById('reporte-fecha-fin').value;
    const tablaBody = document.getElementById('reporte-table-body');
    const cursoSelect = document.getElementById('reporte-curso-select');
    
    tablaBody.innerHTML = '';
    document.getElementById('reporte-session-detail').style.display = 'none';
    lastGeneratedReport = null;
    document.getElementById('save-report-btn').style.display = 'none';

    const cursoNombre = cursoSelect.options[cursoSelect.selectedIndex].text;
    document.getElementById('report-title').textContent = `Reporte: ${cursoNombre} - Paralelo ${paralelo}`;

    const estudiantes = DOCENTE_DATA.estudiantes.filter(e => e.cursoId === cursoId && e.paralelo === paralelo);

    if (estudiantes.length === 0) {
        tablaBody.innerHTML = `<tr><td colspan="6">No hay estudiantes.</td></tr>`;
        return;
    }

    const reportData = estudiantes.map(est => {
        const asistencias = DOCENTE_DATA.historialAsistencia.filter(a => 
            a.cedula === est.cedula && a.cursoId === cursoId && a.paralelo === paralelo && 
            a.fecha >= fechaInicioStr && a.fecha <= fechaFinStr 
        );

        const totalClases = new Set(asistencias.map(a => a.fecha)).size;
        let faltaCount = asistencias.filter(a => a.estado === 'No Asistió').length;
        const percent = totalClases > 0 ? ((totalClases - faltaCount) / totalClases) * 100 : 100;
        
        // XML Umbral
        let riesgo = 'OK';
        let riesgoClass = 'risk-ok';
        if ((100 - percent) > CONFIG_GLOBAL.UMBRAL_RIESGO) {
            riesgo = 'ALTO'; riesgoClass = 'risk-critical';
        }

        return {
            cedula: est.cedula, nombre: est.nombre, faltas: faltaCount,
            asistencia: percent.toFixed(1) + '%', riesgo: `<span class="${riesgoClass}">${riesgo}</span>`,
            totalClases: totalClases, asistencias: asistencias.sort((a, b) => new Date(a.fecha) - new Date(b.fecha))
        };
    }).filter(d => d.totalClases > 0); 

    if (reportData.length === 0) {
        tablaBody.innerHTML = `<tr><td colspan="6">Sin registros.</td></tr>`;
        return;
    }

    reportData.forEach(d => {
        const row = tablaBody.insertRow();
        row.innerHTML = `<td>${d.cedula}</td><td>${d.nombre}</td><td>${d.totalClases}</td><td>${d.faltas}</td><td>${d.asistencia}</td><td>${d.riesgo}</td><td><button class="btn-secondary btn-small" onclick="viewReportDetails('${d.cedula}')">Detalle</button></td>`;
    });

    lastGeneratedReport = {
        nombre: `Reporte ${getTodayDate()}`, cursoId, paralelo,
        fechaGen: getTodayDate(), fechaInicio: fechaInicioStr, fechaFin: fechaFinStr, data: reportData
    };
    document.getElementById('save-report-btn').style.display = 'inline-block';
    openDocenteModal(`Reporte generado (${reportData.length} registros).`);
}

function saveReport() {
    if (!lastGeneratedReport) return;
    const name = prompt("Nombre del reporte:", lastGeneratedReport.nombre);
    if (!name) return;

    lastGeneratedReport.nombre = name;
    if (!DOCENTE_DATA.reportesGuardados) DOCENTE_DATA.reportesGuardados = [];
    DOCENTE_DATA.reportesGuardados.unshift(lastGeneratedReport);
    saveDataToLocal();

    lastGeneratedReport = null;
    document.getElementById('save-report-btn').style.display = 'none';
    if (document.getElementById('report-mode-select').value === 'view') filterSavedReports();
    openDocenteModal('Reporte guardado.');
}

function renderSavedReports(reports) {
    const tbody = document.getElementById('saved-reports-table-body');
    tbody.innerHTML = '';
    if (!reports || reports.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5">No hay reportes.</td></tr>`;
        return;
    }
    reports.forEach((r, i) => {
        const row = tbody.insertRow();
        row.innerHTML = `<td>${r.nombre}</td><td>${r.cursoId} - ${r.paralelo}</td><td>${r.fechaInicio} a ${r.fechaFin}</td><td>${r.fechaGen}</td><td><button class="btn-primary btn-small" onclick="viewSavedReportDetails(${i})">Ver</button></td>`;
    });
}

function filterSavedReports() {
    const search = document.getElementById('view-search-name').value.toLowerCase();
    if (!DOCENTE_DATA.reportesGuardados) return;
    const filtered = DOCENTE_DATA.reportesGuardados.filter(r => r.nombre.toLowerCase().includes(search));
    renderSavedReports(filtered);
}

function viewSavedReportDetails(i) {
    const r = DOCENTE_DATA.reportesGuardados[i];
    if (!r) return;
    lastGeneratedReport = r;
    document.getElementById('report-mode-select').value = 'generate';
    changeReportMode();
    document.getElementById('report-title').textContent = r.nombre;
    const tbody = document.getElementById('reporte-table-body');
    tbody.innerHTML = '';
    r.data.forEach(d => {
        const row = tbody.insertRow();
        row.innerHTML = `<td>${d.cedula}</td><td>${d.nombre}</td><td>${d.totalClases}</td><td>${d.faltas}</td><td>${d.asistencia}</td><td>${d.riesgo}</td><td><button class="btn-secondary btn-small" onclick="viewReportDetails('${d.cedula}')">Detalle</button></td>`;
    });
}

function viewReportDetails(cedula) {
    const data = lastGeneratedReport?.data.find(d => d.cedula === cedula);
    if (!data) return;
    const detailDiv = document.getElementById('reporte-session-detail');
    const tbody = document.getElementById('session-table-body');
    tbody.innerHTML = '';
    document.getElementById('session-detail-title').textContent = `Detalle: ${data.nombre}`;
    data.asistencias.forEach(a => {
        const row = tbody.insertRow();
        let cls = a.estado === 'Asistió' ? 'status-asistio' : (a.estado === 'Justificado' ? 'status-justificado' : 'status-no-asistio');
        row.innerHTML = `<td>${a.fecha}</td><td class="${cls}">${a.estado}</td><td>${a.observacion || ''}</td>`;
    });
    detailDiv.style.display = 'block';
    detailDiv.scrollIntoView({ behavior: 'smooth' });
}

// ... Justificaciones ...
function loadJustificacionesPendientes(init) {
    if (!DOCENTE_DATA.justificaciones) DOCENTE_DATA.justificaciones = [];
    const pendientes = DOCENTE_DATA.justificaciones.filter(j => j.estado === 'Pendiente');
    
    document.getElementById('pending-count').textContent = pendientes.length;
    if (init) return;

    const tbody = document.getElementById('pendientes-table-body');
    tbody.innerHTML = '';
    if (pendientes.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5">No hay pendientes.</td></tr>`;
        return;
    }
    pendientes.forEach(j => {
        const row = tbody.insertRow();
        const est = DOCENTE_DATA.estudiantes.find(e => e.cedula === j.estudianteCedula);
        row.innerHTML = `<td>${j.fecha}</td><td>${est ? est.nombre : j.estudianteCedula}</td><td>${j.cursoId}</td><td>${j.motivo}</td><td><button class="btn-success btn-small" onclick="aprobarJustificacion('${j.fecha}', '${j.estudianteCedula}')">Aprobar</button> <button class="btn-danger btn-small" onclick="rechazarJustificacion('${j.fecha}', '${j.estudianteCedula}')">Rechazar</button></td>`;
    });
}

function aprobarJustificacion(fecha, cedula) {
    const just = DOCENTE_DATA.justificaciones.find(j => j.fecha === fecha && j.estudianteCedula === cedula);
    if (just) {
        just.estado = 'Aprobada';
        const hist = DOCENTE_DATA.historialAsistencia.find(a => a.fecha === fecha && a.cedula === cedula);
        if (hist) hist.estado = 'Justificado';
        saveDataToLocal();
        openDocenteModal('Justificación Aprobada.');
        loadJustificacionesPendientes(false);
    }
}

function rechazarJustificacion(fecha, cedula) {
    const just = DOCENTE_DATA.justificaciones.find(j => j.fecha === fecha && j.estudianteCedula === cedula);
    if (just) {
        just.estado = 'Rechazada';
        saveDataToLocal();
        openDocenteModal('Justificación Rechazada.');
        loadJustificacionesPendientes(false);
    }
}

// Globales
function openDocenteModal(msg) { document.getElementById('docente-modal-message').innerHTML = msg; document.getElementById('success-modal-docente').style.display = 'block'; }
function closeDocenteModal() { document.getElementById('success-modal-docente').style.display = 'none'; }
function logout() { localStorage.removeItem('userRole'); localStorage.removeItem('userName'); window.location.href = 'index.html'; }

window.onclick = e => { if (e.target == document.getElementById('success-modal-docente')) closeDocenteModal(); };

// Exportar para HTML onclick
window.loadRegistro = loadRegistro;
window.saveAndAdvance = saveAndAdvance;
window.finalizarRegistro = finalizarRegistro;
window.regresar = regresar;
window.changeReportMode = changeReportMode;
window.generateReport = generateReport;
window.saveReport = saveReport;
window.filterSavedReports = filterSavedReports;
window.viewSavedReportDetails = viewSavedReportDetails;
window.viewReportDetails = viewReportDetails;
window.aprobarJustificacion = aprobarJustificacion;
window.rechazarJustificacion = rechazarJustificacion;
window.closeDocenteModal = closeDocenteModal;
window.logout = logout;