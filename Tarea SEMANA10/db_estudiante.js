const ESTUDIANTE_INITIAL_DB = {
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