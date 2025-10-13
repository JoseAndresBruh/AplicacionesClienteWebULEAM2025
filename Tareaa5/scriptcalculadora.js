let i = 0; 
let resultadosHistoricos = [];
const operaciones = ["Sumar", "Restar", "Multiplicar", "Dividir", "Módulo (%)"];

document.addEventListener('DOMContentLoaded', () => {
    actualizarBoton();
});

function actualizarBoton() {
    const boton = document.querySelector('.interaccion button');
    if (i < 5) {
        boton.textContent = `Calcular (${i + 1}. ${operaciones[i]})`;
    } else {
        boton.textContent = `Ciclo Finalizado`;
        boton.disabled = true;
    }}

function ejecutarOperacion() {    const v1 = parseFloat(document.getElementById('valor1').value);
    const v2 = parseFloat(document.getElementById('valor2').value);
    const resultadoElement = document.getElementById('resultado');

    let resultado = 0;
    let operacionNombre = "";

    if (isNaN(v1) || isNaN(v2) || i >= 5) {
        resultadoElement.style.color = 'red';
        if (i >= 5) {
            resultadoElement.innerHTML = "Ciclo de 5 operaciones completado. Por favor, reinicie.";
        } else {
            resultadoElement.innerHTML = "Error: Ingrese dos valores numéricos válidos.";
        }
        return;    }

    if (i === 0) {
        // 1. Sumar
        resultado = v1 + v2;
        operacionNombre = "Suma";
    } else if (i === 1) {
        // 2. Restar
        resultado = v1 - v2;
        operacionNombre = "Resta";
    } else if (i === 2) {
        // 3. Multiplicar
        resultado = v1 * v2;
        operacionNombre = "Multiplicación";
    } else if (i === 3) {
        // 4. Dividir
        if (v2 === 0) {
            resultadoElement.style.color = 'red';
            resultadoElement.innerHTML = "Error: No se puede dividir por cero.";
            return;
        }
        resultado = v1 / v2;
        operacionNombre = "División";
    } else if (i === 4) {
        // 5. Módulo (%)
        resultado = v1 % v2;
        operacionNombre = "Módulo (%)";
    }

    resultadosHistoricos.push({
        iteracion: i + 1,
        operacion: operacionNombre,
        valor: resultado.toFixed(2)
    });

    resultadoElement.style.color = '#0056b3';
    let historicoHTML = '<h2>Resultados Históricos:</h2><ul>';
    resultadosHistoricos.forEach(res => {
        historicoHTML += `<li>${res.iteracion}. ${res.operacion}: ${res.valor}</li>`;
    });
    historicoHTML += '</ul>';

    resultadoElement.innerHTML = `Resultado de la ${operacionNombre}: **${resultado.toFixed(2)}**` + historicoHTML;

    i++; 
    actualizarBoton();
}

function reiniciarCalculadora() {
    i = 0;
    resultadosHistoricos = [];
    
    document.getElementById('valor1').value = '';
    document.getElementById('valor2').value = '';
    document.getElementById('resultado').style.color = '#333';
    document.getElementById('resultado').innerHTML = "Sistema reiniciado. Resultado: 0.00";
    
    document.querySelector('.interaccion button').disabled = false;
    actualizarBoton();
}