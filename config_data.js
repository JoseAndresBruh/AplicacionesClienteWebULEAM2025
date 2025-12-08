// config_data.js
// Contiene la configuración global en formato XML.
// Se usa una variable JS para evitar bloqueos CORS en modo local.

const GLOBAL_CONFIG_XML = `<?xml version="1.0" encoding="UTF-8"?>
<configuracion>
    <institucion>
        <nombre>ULEAM</nombre>
        <departamento>Gestión Académica</departamento>
    </institucion>
    <reglas>
        <plazo_justificacion dias="7" />
        <umbral_riesgo porcentaje="30" />
    </reglas>
    <integraciones>
        <url_office365>https://portal.office.com/uleam</url_office365>
    </integraciones>
</configuracion>`;