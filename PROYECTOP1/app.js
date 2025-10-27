const USERS = [
    // Usuario Docente Principal: José Loor (el solicitado)
    { correo: 'docente@uleam.edu.ec', contrasena: '12345', rol: 'docente', nombreCompleto: 'José Loor' }, 
    // Usuario Estudiante Principal: José Loor (el solicitado)
    { correo: 'estudiante@uleam.edu.ec', contrasena: '12345', rol: 'estudiante', nombreCompleto: 'José Loor' }, 
    // Usuario Docente Alterno: Roberto Gomez (el solicitado)
    { correo: 'otro.docente@uleam.edu.ec', contrasena: 'abcde', rol: 'docente', nombreCompleto: 'Roberto Gomez' },
];
// ------------------------------------------------------------------------

document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Evita el envío tradicional del formulario

    const correo = document.getElementById('correo').value;
    const contrasena = document.getElementById('contrasena').value;
    const errorMessage = document.getElementById('error-message');
    errorMessage.textContent = '';

    // Buscar usuario
    const user = USERS.find(u => u.correo === correo && u.contrasena === contrasena);

    if (user) {
        // AUTENTICACIÓN EXITOSA - GUARDAR ROL, CORREO Y NOMBRE COMPLETO
        localStorage.setItem('userRole', user.rol);
        localStorage.setItem('userCorreo', user.correo);
        localStorage.setItem('userName', user.nombreCompleto); // <-- AHORA GUARDA "José Loor" o "Roberto Gomez"
        
        let redirectUrl = '';
        
        if (user.rol === 'docente') {
            redirectUrl = 'dashboard_docente.html';
        } else if (user.rol === 'estudiante') {
            redirectUrl = 'dashboard_estudiante.html';
        }

        console.log(`Inicio de sesión exitoso. Redirigiendo como: ${user.rol}`);
        window.location.href = redirectUrl;

    } else {
        // AUTENTICACIÓN FALLIDA
        errorMessage.textContent = 'Credenciales incorrectas. Verifique su correo y contraseña.';
    }
});

function loginOffice365() {
    // Simulación del flujo de Office365: siempre lleva al docente principal
    localStorage.setItem('userRole', 'docente');
    localStorage.setItem('userCorreo', 'docente@uleam.edu.ec');
    localStorage.setItem('userName', 'José Loor'); 
    console.log('Simulación de inicio de sesión con Office365. Redirigiendo como Docente.');
    window.location.href = 'dashboard_docente.html';
}