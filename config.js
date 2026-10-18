// ============================================================================
//  config.js — Datos de conexión a Supabase
// ============================================================================
//
//  👉 EDITAR SOLO ESTE ARCHIVO cuando crees tu proyecto en Supabase.
//
//  Cómo encontrar los dos valores:
//    1. Entra a https://supabase.com/dashboard y abre tu proyecto
//    2. Menú lateral -> "Project Settings" -> "API" (o "API Keys")
//    3. Copia:
//       - "Project URL"           -> va en URL
//       - "Publishable key"       -> va en CLAVE  (antes se llamaba "anon key")
//
//  ⚠ La clave "publishable"/"anon" está pensada para el navegador: es pública
//    y no hay problema en que se vea en el código. Lo que protege los datos
//    son las reglas de seguridad (RLS) del esquema, que ya tame en esquema.sql.
//
//  ⚠ NO pongas aquí la "service_role key" ni la "secret key": esas dan acceso
//    total a la base de datos y NO deben publicarse nunca.
// ============================================================================

const CONFIG_SUPABASE = {
  URL: 'https://PEGUE-AQUI-TU-PROJECT-URL.supabase.co',

  // Placeholder: mientras siga así, la web funciona igual que antes
  // (guarda todo en localStorage) y avisa por consola de que falta configurar.
  CLAVE: 'PEGUE-AQUI-TU-PUBLISHABLE-KEY',

  TABLA_PERFILES: 'perfiles',
  TABLA_OFERTAS: 'ofertas',
  TABLA_POSTULACIONES: 'postulaciones',
};

// ¿Está bien configurado?
const SUPABASE_ACTIVO =
  CONFIG_SUPABASE.URL.startsWith('https://') &&
  !CONFIG_SUPABASE.URL.includes('PEGUE-AQUI') &&
  CONFIG_SUPABASE.CLAVE.length > 20 &&
  !CONFIG_SUPABASE.CLAVE.includes('PEGUE-AQUI');

// Si falta configurar, avisamos una sola vez para que sea fácil de debuggear.
if (!SUPABASE_ACTIVO) {
  console.warn(
    '[EstuTrabajo] Supabase NO está configurado todavía.\n' +
    '               Edita js/config.js y pega tu URL y tu publishable key.\n' +
    '               Mientras tanto la web sigue funcionando con localStorage.'
  );
}