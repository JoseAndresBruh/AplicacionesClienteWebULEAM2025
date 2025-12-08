// db_docente.js
// Base de datos inicial del Docente en formato JSON.

const DOCENTE_INITIAL_DB = {
    "cursos": [
        { "id": "mat", "nombre": "Matemáticas Avanzadas", "paralelos": ["A", "B"] },
        { "id": "prog", "nombre": "Programación Web I", "paralelos": ["A", "B", "C"] }
    ],
    "estudiantes": [
        { "cedula": "1301010101", "nombre": "José Loor", "cursoId": "mat", "paralelo": "A" },
        { "cedula": "1313131313", "nombre": "Sans E. Skeleton", "cursoId": "mat", "paralelo": "A" },
        { "cedula": "1300112233", "nombre": "Gómez Ana Sofía", "cursoId": "mat", "paralelo": "A" },
        { "cedula": "1300000001", "nombre": "Ramírez José P.", "cursoId": "mat", "paralelo": "A" },
        { "cedula": "1300000002", "nombre": "Vásquez María T.", "cursoId": "mat", "paralelo": "A" },
        { "cedula": "1300445566", "nombre": "Pérez Carlos A.", "cursoId": "mat", "paralelo": "B" },
        { "cedula": "1300778899", "nombre": "Rodas María F.", "cursoId": "mat", "paralelo": "B" },
        { "cedula": "0909090909", "nombre": "Windings Goster", "cursoId": "prog", "paralelo": "A" },
        { "cedula": "1305456789", "nombre": "Boom Gerson", "cursoId": "prog", "paralelo": "A" },
        { "cedula": "1312789012", "nombre": "Dreemurr Toriel", "cursoId": "prog", "paralelo": "B" }
    ],
    "justificaciones": [
        { "cursoId": "mat", "estudianteCedula": "1301010101", "fecha": "2025-10-15", "motivo": "Cita médica urgente.", "estado": "Pendiente" }
    ],
    "historialAsistencia": [
        { "cedula": "1301010101", "estado": "Asistió", "fecha": "2025-09-01", "cursoId": "mat", "paralelo": "A" },
        { "cedula": "1301010101", "estado": "No Asistió", "observacion": "Gripe fuerte.", "fecha": "2025-09-04", "cursoId": "mat", "paralelo": "A" },
        { "cedula": "1301010101", "estado": "Justificado", "observacion": "Cita IESS aprobada.", "fecha": "2025-09-05", "cursoId": "mat", "paralelo": "A" },
        { "cedula": "1301010101", "estado": "Asistió", "fecha": "2025-09-06", "cursoId": "mat", "paralelo": "A" }
    ],
    "reportesGuardados": []
};