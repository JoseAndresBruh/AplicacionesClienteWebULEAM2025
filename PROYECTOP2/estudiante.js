// =============================================================================
//  GESTIÓN DE DATOS ESTUDIANTE (CON RESPALDO INTEGRADO)
// =============================================================================

let STUDENT_DATA = null;
let CONFIG_GLOBAL = {};
let selectedFalta = null; 

const formatDate = (date) => date.toISOString().split('T')[0];

// --- DATOS DE RESPALDO (Por si falla la carga del archivo externo) ---
const DATOS_RESPALDO = {
    "cursos": [
        { "id": "mat", "nombre": "Matemáticas Avanzadas", "totalClases": 20 },
        { "id": "prog", "nombre": "Programación Web I", "totalClases": 25 },
        { "id": "soft", "nombre": "Ingeniería de Software", "totalClases": 30 }
    ],
    "asistencias": [
        { "cursoId": "mat", "fecha": "2025-10-01", "tema": "Integrales de Volumen", "estado": "Asistió" },
        { "cursoId": "mat", "fecha": "2025-10-15", "tema": "Ecuaciones Diferenciales", "estado": "No Asistió" },
        { "cursoId": "mat", "fecha": "2025-10-26", "tema": "Series de Fourier", "estado": "No Asistió" },
        { "cursoId": "mat", "fecha": "2025-10-27", "tema": "Repaso Final", "estado": "Asistió" },
        { "cursoId": "prog", "fecha": "2025-10-20", "tema": "HTML Semántico", "estado": "Asistió" },
        { "cursoId": "prog", "fecha": "2025-10-21", "tema": "CSS Flexbox", "estado": "No Asistió" },
        { "cursoId": "prog", "fecha": "2025-10-22", "tema": "JavaScript ES6", "estado": "Justificado" },
        { "cursoId": "prog", "fecha": "2025-10-23", "tema": "APIs REST", "estado": "Asistió" }
    ]
};

document.addEventListener('DOMContentLoaded', () => {
    // 1. Seguridad
    const userRole = localStorage.getItem('userRole');
    const userName = localStorage.getItem('userName');
    
    if (userRole !== 'estudiante') {
        alert('Acceso denegado. Redirigiendo al login.');
        window.location.href = 'index.html';
        return;
    }

    const nameDisplay = document.getElementById('student-name-display');
    if(nameDisplay) nameDisplay.textContent = userName || 'Estudiante';

    // 2. Inicialización
    try {
        loadConfigXML(); // Carga configuración
        
        // Cargar datos (o usar respaldo)
        loadStudentData(); 
        
        // Iniciar interfaz
        initStudentInterface();
        
    } catch (e) {
        console.error("Error inicializando:", e);
    }
});

// --- Funciones de Carga ---

function loadConfigXML() {
    // Intenta usar la variable del archivo config_data.js
    if (typeof GLOBAL_CONFIG_XML !== 'undefined') {
        const parser = new DOMParser();
        const xml = parser.parseFromString(GLOBAL_CONFIG_XML, "text/xml");
        const dias = xml.getElementsByTagName('plazo_justificacion')[0]?.getAttribute('dias') || 7;
        CONFIG_GLOBAL.PLAZO_DIAS = parseInt(dias);
    } else {
        // Respaldo si falla config_data.js
        console.warn("XML no encontrado. Usando configuración por defecto.");
        CONFIG_GLOBAL = { PLAZO_DIAS: 7 }; 
    }
}

function loadStudentData() {
    // 1. Intentar LocalStorage (Persistencia)
    const stored = localStorage.getItem('STUDENT_DATA_PERSIST');
    if (stored) {
        try {
            STUDENT_DATA = JSON.parse(stored);
            // Verificar integridad básica
            if (STUDENT_DATA && STUDENT_DATA.cursos && STUDENT_DATA.cursos.length > 0) {
                console.log("Datos cargados desde LocalStorage.");
                return;
            }
        } catch(e) {
            console.warn("Datos corruptos en LocalStorage.");
        }
    }
    
    // 2. Intentar Variable Externa (db_estudiante.js)
    if (typeof ESTUDIANTE_INITIAL_DB !== 'undefined') {
        console.log("Cargando desde archivo externo db_estudiante.js");
        STUDENT_DATA = JSON.parse(JSON.stringify(ESTUDIANTE_INITIAL_DB));
    } 
    // 3. ÚLTIMO RECURSO: Usar datos integrados (Plan B)
    else {
        console.warn("Fallo al cargar archivo externo. Usando DATOS DE RESPALDO integrados.");
        STUDENT_DATA = JSON.parse(JSON.stringify(DATOS_RESPALDO));
    }
    
    // Guardar estado inicial limpio
    saveData();
}

function saveData() {
    if(STUDENT_DATA) {
        localStorage.setItem('STUDENT_DATA_PERSIST', JSON.stringify(STUDENT_DATA));
    }
}

// --- Interfaz ---

function initStudentInterface() {
    const select = document.getElementById('curso-select');
    if (!select) return;
    
    select.innerHTML = ''; 

    // Llenar Cursos
    if (STUDENT_DATA && STUDENT_DATA.cursos && STUDENT_DATA.cursos.length > 0) {
        STUDENT_DATA.cursos.forEach(c => {
            const opt = document.createElement('option');
            opt.value = c.id;
            opt.textContent = c.nombre;
            select.appendChild(opt);
        });
        
        // Seleccionar primero automáticamente
        select.value = STUDENT_DATA.cursos[0].id;
        loadAsistenciaTable();
    } else {
        select.innerHTML = '<option>Sin cursos</option>';
    }
    
    select.addEventListener('change', loadAsistenciaTable);
    
    // Mostrar alerta de plazo
    const alerta = document.querySelector('.alerta-plazo');
    if(alerta) {
        alerta.textContent = `Plazo máximo para justificar (XML): ${CONFIG_GLOBAL.PLAZO_DIAS} días.`;
    }
}

function loadAsistenciaTable() {
    const cursoId = document.getElementById('curso-select').value;
    const tbody = document.querySelector('#asistencia-table tbody');
    if(!tbody) return;
    
    tbody.innerHTML = '';
    
    // Filtro de seguridad
    if (!STUDENT_DATA || !STUDENT_DATA.asistencias) return;

    const asistencias = STUDENT_DATA.asistencias.filter(a => a.cursoId === cursoId);
    
    if (asistencias.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4">No hay asistencias registradas.</td></tr>';
        const pDisplay = document.getElementById('percent-display');
        if(pDisplay) pDisplay.textContent = '--%';
        return;
    }
    
    let totalClases = asistencias.length;
    let asistioCount = 0;

    asistencias.forEach(item => {
        if (item.estado === 'Asistió' || item.estado === 'Justificado') asistioCount++;

        const row = tbody.insertRow();
        const fechaClase = new Date(item.fecha);
        const hoy = new Date();
        const diffDias = Math.ceil(Math.abs(hoy - fechaClase) / (1000 * 60 * 60 * 24));
        const esJustificable = item.estado === 'No Asistió' && diffDias <= CONFIG_GLOBAL.PLAZO_DIAS;
        
        let accionHtml = '-';
        let estadoClass = '';

        if (item.estado === 'Asistió') estadoClass = 'status-asistio';
        else if (item.estado === 'No Asistió') estadoClass = 'status-no-asistio';
        else if (item.estado === 'Justificado') estadoClass = 'status-justificado';
        else if (item.estado === 'Pendiente de Revisión') estadoClass = 'status-pendiente';

        if(esJustificable) {
            accionHtml = `<a href="#" onclick="event.preventDefault(); openModal('${item.fecha}', '${item.tema}', '${item.cursoId}')">Solicitar Justificación</a>`;
        } else if (item.estado === 'No Asistió') {
            accionHtml = 'Plazo Vencido';
        } else if (item.estado === 'Pendiente de Revisión') {
            accionHtml = 'En Revisión';
        }

        row.innerHTML = `<td>${item.fecha}</td><td>${item.tema}</td><td class="${estadoClass}">${item.estado}</td><td>${accionHtml}</td>`;
    });

    const percentDisplay = document.getElementById('percent-display');
    if (percentDisplay) {
        const percent = totalClases > 0 ? (asistioCount / totalClases) * 100 : 100;
        percentDisplay.textContent = `${percent.toFixed(1)}%`;
    }
}

// --- Modales ---

function openModal(fecha, tema, cursoId) {
    selectedFalta = { fecha, cursoId };
    const modal = document.getElementById('justificacion-modal');
    document.getElementById('falta-detalle').textContent = `${tema} (${fecha})`;
    if(modal) modal.style.display = 'block';
}

function closeModal() {
    const modal = document.getElementById('justificacion-modal');
    if(modal) {
        modal.style.display = 'none';
        document.getElementById('justificacionForm').reset();
    }
    selectedFalta = null;
}

function openSuccessModal() {
    const m = document.getElementById('success-modal');
    if(m) m.style.display = 'block';
}

function closeSuccessModal() {
    const m = document.getElementById('success-modal');
    if(m) m.style.display = 'none';
}

const form = document.getElementById('justificacionForm');
if (form) {
    form.addEventListener('submit', function(event) {
        event.preventDefault();
        const motivo = document.getElementById('motivo').value;
        
        if (!motivo) { alert('Motivo requerido'); return; }

        const index = STUDENT_DATA.asistencias.findIndex(a => 
            a.fecha === selectedFalta.fecha && a.cursoId === selectedFalta.cursoId
        );

        if (index !== -1) {
            STUDENT_DATA.asistencias[index].estado = 'Pendiente de Revisión';
            saveData();
            openSuccessModal();
            loadAsistenciaTable(); 
        }
        closeModal();
    });
}

function logout() {
    localStorage.removeItem('userRole');
    localStorage.removeItem('userName');
    window.location.href = 'index.html';
}

window.onclick = function(event) {
    const modalJ = document.getElementById('justificacion-modal');
    const modalS = document.getElementById('success-modal');
    if (event.target === modalJ) closeModal();
    if (event.target === modalS) closeSuccessModal();
};

window.openModal = openModal;
window.closeModal = closeModal;
window.closeSuccessModal = closeSuccessModal;
window.logout = logout;