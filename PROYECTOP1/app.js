const USERS = [
    { correo: 'docente@uleam.edu.ec', contrasena: '12345', rol: 'docente', nombreCompleto: 'José Loor' }, 
    { correo: 'estudiante@uleam.edu.ec', contrasena: '12345', rol: 'estudiante', nombreCompleto: 'José Loor' }, 
    { correo: 'otro.docente@uleam.edu.ec', contrasena: 'abcde', rol: 'docente', nombreCompleto: 'Roberto Gomez' },
];

document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const correo = document.getElementById('correo').value;
    const contrasena = document.getElementById('contrasena').value;
    const errorMessage = document.getElementById('error-message');
    errorMessage.textContent = '';

    const user = USERS.find(u => u.correo === correo && u.contrasena === contrasena);

    if (user) {
        localStorage.setItem('userRole', user.rol);
        localStorage.setItem('userCorreo', user.correo);
        localStorage.setItem('userName', user.nombreCompleto);
        
        let redirectUrl = '';
        
        if (user.rol === 'docente') {
            redirectUrl = 'dashboard_docente.html';
        } else if (user.rol === 'estudiante') {
            redirectUrl = 'dashboard_estudiante.html';
        }

        console.log(`Inicio de sesión exitoso. Redirigiendo como: ${user.rol}`);
        window.location.href = redirectUrl;

    } else {
        errorMessage.textContent = 'Credenciales incorrectas. Verifique su correo y contraseña.';
    }
});

function loginOffice365() {
    localStorage.setItem('userRole', 'docente');
    localStorage.setItem('userCorreo', 'docente@uleam.edu.ec');
    localStorage.setItem('userName', 'José Loor'); 
    console.log('Simulación de inicio de sesión con Office365. Redirigiendo como Docente.');
    window.location.href = 'dashboard_docente.html';
}