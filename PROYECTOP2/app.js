const { createApp, ref, reactive, computed, onMounted } = Vue;

createApp({
    setup() {
        const viewState = ref('login');
        const currentUser = ref(null);
        const currentTab = ref('registro');
        const error = ref('');
        const showModal = ref(false);
        const showSuccess = ref(false);
        const attachmentModal = ref(false);
        const attachmentUrl = ref('');
        const successMessage = ref('');
        const config = reactive({ plazo: 7, umbral: 30 });
        
        const loginForm = reactive({ correo: '', contrasena: '' });
        const docenteSelection = reactive({ curso: 'mat', paralelo: 'A', fecha: '2026-01-21' });
        const studentSelection = reactive({ curso: 'mat' });
        const reportFilter = reactive({ curso: 'mat', paralelo: 'A' });
        
        const attendanceBatch = reactive({});
        const attendanceNotes = reactive({});
        const selectedFalta = ref(null);
        const justificationForm = reactive({ motivo: '', archivo: null });
        const generatedReport = ref([]);

        const bgClass = computed(() => {
            if (viewState.value === 'login' || viewState.value === 'selectProfile') return 'bg-login';
            if (currentUser.value?.rol === 'estudiante') return 'bg-estudiante';
            return 'bg-docente';
        });

        const docenteData = reactive({ cursos: [], estudiantes: [], historial: [], justificaciones: [] });
        const studentData = reactive({ cursos: [], asistencias: [] });

        onMounted(() => {
            const saved = localStorage.getItem('uleam_session');
            if (saved) {
                currentUser.value = JSON.parse(saved);
                viewState.value = 'dashboard';
            }
            if (typeof GLOBAL_CONFIG_XML !== 'undefined') {
                const parser = new DOMParser();
                const xml = parser.parseFromString(GLOBAL_CONFIG_XML, "text/xml");
                config.plazo = parseInt(xml.getElementsByTagName('plazo_justificacion')[0]?.getAttribute('dias') || 7);
                config.umbral = parseInt(xml.getElementsByTagName('umbral_riesgo')[0]?.getAttribute('porcentaje') || 30);
            }
            initializeDatabase();
        });

        const initializeDatabase = () => {
            if (!localStorage.getItem('uleam_db_presentation_master_v3')) {
                const polsA = ["Javier Milei", "Donald Trump", "Nicolas Maduro", "Rafael Correa", "Nayib Bukele", "Claudia Sheinbaum", "Vladimir Putin", "Kim Jong-un", "Joe Biden", "Lula da Silva", "José Andrés Loor"];
                const polsB = ["Giorgia Meloni", "Viktor Orban", "Emmanuel Macron", "Olaf Scholz", "Xi Jinping", "Fumio Kishida", "Volodymyr Zelensky", "Gabriel Boric", "Sanna Marin", "Rishi Sunak", "Justin Trudeau"];

                const courses = [
                    { id: "mat", nombre: "Matemáticas Avanzadas", docente: "1350153670" },
                    { id: "prog", nombre: "Programación Web I", docente: "1350153670" },
                    { id: "soft", nombre: "Ingeniería de Software", docente: "1367911777" },
                    { id: "db", nombre: "Bases de Datos Distribuidas", docente: "1367911777" },
                    { id: "web", nombre: "Aplicaciones Cliente Web", docente: "1367911777" }
                ];

                const studentList = [];
                courses.forEach(c => {
                    polsA.forEach((n, i) => studentList.push({ cedula: n === "José Andrés Loor" ? "1350153670" : (1400 + i).toString(), nombre: n, cursoId: c.id, paralelo: "A" }));
                    polsB.forEach((n, i) => studentList.push({ cedula: (2400 + i).toString(), nombre: n, cursoId: c.id, paralelo: "B" }));
                });

                const history = [];
                const themes = {
                    mat: ["Variables Complejas", "Series Fourier", "Transformada Z", "Cálculo 3", "Integrales Triples", "Derivadas Parciales", "Campos Escalares", "Teorema Green", "Stokes", "Divergencia", "Análisis Real", "Examen Final"],
                    prog: ["Vue Instances", "Directivas Reactivas", "Computed Props", "Watcher Logic", "Binding Classes", "Event Handling", "Lifecycle Hooks", "Vue CLI Setup", "Router Config", "State Pinia", "API REST Call", "Web Dev Thesis"],
                    soft: ["Modelos Ágiles", "Scrum Framework", "Historias Usuario", "Kanban Visual", "Product Backlog", "Sprint Review", "TDD Testing", "Patrones SOLID", "CI/CD Pipeline", "Arquitectura MVC", "Refactorización", "QA Delivery"],
                    db: ["Motores Storage", "Indices B-Tree", "Normalización", "Transacciones", "Replicación", "Sharding", "NoSQL Mongo", "Graph DB", "Big Data", "Optimización", "Backup Plan", "Security SQL"],
                    web: ["PWA Intro", "Service Workers", "SEO Semántico", "JWT Security", "Web Sockets", "WebAssembly", "Node.js Server", "Middleware Auth", "CSS Modules", "Fetch Logic", "Responsive UI", "Final Deploy"]
                };

                const obs = ["Excelente participación", "Llegó 15 min tarde", "Entregó taller a tiempo", "Falta injustificada", "Retiro temprano autorizado", "Sin novedad"];

                Object.keys(themes).forEach(sid => {
                    themes[sid].forEach((tema, i) => {
                        const dia = (i + 1).toString().padStart(2, '0');
                        let estado = "Asistió";
                        let observacion = obs[Math.floor(Math.random() * obs.length)];
                        
                        if (i === 10) { estado = "No Asistió"; observacion = "Falta por registrar"; } 
                        if (i === 11) { estado = "No Asistió"; observacion = "Pendiente registro diario"; } 
                        
                        history.push({ id: Math.random(), fecha: `2026-01-${dia}`, cedula: "1350153670", cursoId: sid, estado, tema, observacion });
                    });
                });

                localStorage.setItem('uleam_estudiantes', JSON.stringify(studentList));
                localStorage.setItem('uleam_cursos', JSON.stringify(courses));
                localStorage.setItem('uleam_historial', JSON.stringify(history));
                localStorage.setItem('uleam_db_presentation_master_v3', 'true');
            }
            refreshAllData();
        };

        const refreshAllData = () => {
            docenteData.estudiantes = JSON.parse(localStorage.getItem('uleam_estudiantes') || '[]');
            docenteData.historial = JSON.parse(localStorage.getItem('uleam_historial') || '[]');
            docenteData.justificaciones = JSON.parse(localStorage.getItem('uleam_justificaciones') || '[]');
            const allCursos = JSON.parse(localStorage.getItem('uleam_cursos') || '[]');
            studentData.cursos = allCursos;
            if (currentUser.value?.rol === 'docente') {
                docenteData.cursos = allCursos.filter(c => c.docente === currentUser.value.cedula);
                docenteSelection.curso = docenteData.cursos[0]?.id;
            }
            studentData.asistencias = docenteData.historial.filter(h => h.cedula === "1350153670");
            initAttendanceMap();
        };

        const initAttendanceMap = () => {
            docenteData.estudiantes.forEach(e => { attendanceBatch[e.cedula] = 'Asistió'; attendanceNotes[e.cedula] = ''; });
        };

        const handleLogin = () => {
            const profiles = [
                { correo: 'docente@uleam.edu.ec', contrasena: '12345', rol: 'docente', cedula: '1350153670', nombreCompleto: 'José Loor' },
                { correo: 'docente2@uleam.edu.ec', contrasena: '12345', rol: 'docente', cedula: '1367911777', nombreCompleto: 'Andrés Pérez' },
                { correo: 'estudiante@uleam.edu.ec', contrasena: '12345', rol: 'estudiante', cedula: '1350153670', nombreCompleto: 'José Andrés Loor' }
            ];
            const user = profiles.find(u => u.correo === loginForm.correo && u.contrasena === loginForm.contrasena);
            if (user) {
                currentUser.value = user;
                localStorage.setItem('uleam_session', JSON.stringify(user));
                refreshAllData();
                viewState.value = 'dashboard';
            } else { error.value = 'Acceso denegado.'; }
        };

        const loginAsProfile = (rol, ced) => {
            const data = { '1350153670': rol === 'docente' ? 'José Loor' : 'José Andrés Loor', '1367911777': 'Andrés Pérez' };
            const emailMap = { '1350153670': rol === 'docente' ? 'docente@uleam.edu.ec' : 'estudiante@uleam.edu.ec', '1367911777': 'docente2@uleam.edu.ec' };
            const user = { correo: emailMap[ced], rol, cedula: ced, nombreCompleto: data[ced] };
            currentUser.value = user;
            localStorage.setItem('uleam_session', JSON.stringify(user));
            refreshAllData();
            viewState.value = 'dashboard';
        };

        const logout = () => {
            localStorage.removeItem('uleam_session');
            currentUser.value = null;
            viewState.value = 'login';
        };

        const saveAttendanceBatch = () => {
            filteredStudents.value.forEach(e => {
                docenteData.historial.push({ 
                    id: Date.now()+Math.random(), 
                    fecha: docenteSelection.fecha, 
                    cedula: e.cedula, 
                    cursoId: docenteSelection.curso, 
                    estado: attendanceBatch[e.cedula], 
                    tema: "Registro Diario Manual",
                    observacion: attendanceNotes[e.cedula] || "Asistencia registrada"
                });
            });
            localStorage.setItem('uleam_historial', JSON.stringify(docenteData.historial));
            refreshAllData();
            successMessage.value = 'Registros almacenados con éxito.';
            showSuccess.value = true;
        };

        const generateReport = () => {
            const results = [];
            filteredStudents.value.forEach(s => {
                const hist = docenteData.historial.filter(h => h.cedula === s.cedula && h.cursoId === reportFilter.curso);
                const total = Math.max(hist.length, 12);
                const faltas = hist.filter(h => h.estado === 'No Asistió').length;
                const porc = (((total - faltas) / total) * 100).toFixed(1);
                results.push({ cedula: s.cedula, nombre: s.nombre, total, faltas, porcentaje: porc });
            });
            generatedReport.value = results;
        };

        const resolveJustification = (j, est) => {
            j.estado = est;
            if (est === 'Aprobada') {
                const h = docenteData.historial.find(x => x.fecha === j.fecha && x.cedula === j.estudianteCedula && x.cursoId === j.cursoId);
                if (h) h.estado = 'Justificado';
            }
            localStorage.setItem('uleam_justificaciones', JSON.stringify(docenteData.justificaciones));
            localStorage.setItem('uleam_historial', JSON.stringify(docenteData.historial));
            refreshAllData();
        };

        const submitJustification = () => {
            const nueva = { 
                id: Date.now(), 
                fecha: selectedFalta.value.fecha, 
                estudianteCedula: "1350153670", 
                estudianteNombre: "José Andrés Loor", 
                cursoId: selectedFalta.value.cursoId, 
                motivo: justificationForm.motivo, 
                estado: 'Pendiente', 
                urlAdjunto: justificationForm.archivo 
            };
            docenteData.justificaciones.push(nueva);
            const h = docenteData.historial.find(x => x.fecha === selectedFalta.value.fecha && x.cedula === "1350153670" && x.cursoId === selectedFalta.value.cursoId);
            if (h) h.estado = 'Pendiente de Revisión';
            localStorage.setItem('uleam_justificaciones', JSON.stringify(docenteData.justificaciones));
            localStorage.setItem('uleam_historial', JSON.stringify(docenteData.historial));
            showModal.value = false;
            successMessage.value = 'Justificativo en revisión académica.';
            showSuccess.value = true;
            refreshAllData();
        };

        const viewAttachment = (j) => {
            if (j.urlAdjunto) {
                attachmentUrl.value = j.urlAdjunto;
                attachmentModal.value = true;
            } else {
                alert("Este registro no contiene imagen de respaldo.");
            }
        };

        const filteredStudents = computed(() => docenteData.estudiantes.filter(e => e.cursoId === docenteSelection.curso && e.paralelo === docenteSelection.paralelo));

        return {
            viewState, currentUser, currentTab, loginForm, error, showModal, showSuccess, attachmentModal, attachmentUrl, successMessage,
            docenteSelection, studentSelection, reportFilter, docenteData, studentData,
            attendanceBatch, attendanceNotes, selectedFalta, justificationForm, generatedReport,
            handleLogin, loginAsProfile, logout, filteredStudents, viewAttachment,
            studentStats: computed(() => {
                const data = studentData.asistencias.filter(a => a.cursoId === studentSelection.curso);
                if (data.length === 0) return 100;
                const ok = data.filter(a => a.estado === 'Asistió' || a.estado === 'Justificado').length;
                return ((ok / data.length) * 100).toFixed(1);
            }),
            filteredStudentAttendance: computed(() => studentData.asistencias.filter(a => a.cursoId === studentSelection.curso)),
            pendingJustifications: computed(() => docenteData.justificaciones.filter(j => {
                const course = studentData.cursos.find(c => c.id === j.cursoId);
                return j.estado === 'Pendiente' && course?.docente === currentUser.value.cedula;
            })),
            pendingCount: computed(() => docenteData.justificaciones.filter(j => {
                const course = studentData.cursos.find(c => c.id === j.cursoId);
                return j.estado === 'Pendiente' && course?.docente === currentUser.value.cedula;
            }).length),
            saveAttendanceBatch, generateReport, resolveJustification,
            checkPlazo: (a) => Math.ceil(Math.abs(new Date('2026-01-21') - new Date(a.fecha)) / 86400000) <= config.plazo,
            getStatusClass: (s) => ({ 'status-asistio': s === 'Asistió', 'status-no-asistio': s === 'No Asistió', 'status-justificado': s === 'Justificado', 'status-pendiente': s === 'Pendiente de Revisión' }),
            openModal: (a) => { selectedFalta.value = a; showModal.value = true; },
            submitJustification, handleFileUpload: (e) => { if (e.target.files[0]) justificationForm.archivo = URL.createObjectURL(e.target.files[0]); },
            bgClass, currentCourseName: computed(() => docenteData.cursos.find(c => c.id === docenteSelection.curso)?.nombre || 'Materia'),
            currentStudentCourseName: computed(() => studentData.cursos.find(c => c.id === studentSelection.curso)?.nombre || 'Asignatura')
        };
    }
}).mount('#app');