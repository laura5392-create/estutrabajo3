// ============================================================================
//  supabase.js — Cliente de Supabase + funciones de datos
// ============================================================================
//
//  Este archivoenvuelve la librería de Supabase en un español más claro.
//  El resto del proyecto habla con la base de datos a través de estas
//  funciones, sin tener que>import nada directamente.
//
//  Carga la librería desde el CDN: no necesitas npm ni build.
// ============================================================================

// --- Librería de Supabase (CDN oficial) ---
const _cargarSupabase = () => new Promise((resolve, reject) => {
  if (window.supabase) return resolve(window.supabase);

  const guion = document.createElement('script');
  guion.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';
  guion.onload = () => (window.supabase
    ? resolve(window.supabase)
    : reject(new Error('La librería de Supabase cargó pero no se encontró window.supabase')));
  guion.onerror = () => reject(new Error('No se pudo cargar Supabase desde el CDN. Revisa tu conexión.'));
  document.head.appendChild(guion);
});

// --- Cliente (se crea una sola vez) ---
const clienteSupabase = (() => {
  let promesa = null;

  return () => {
    if (!SUPABASE_ACTIVO) return Promise.reject(new Error('Supabase no está configurado'));
    if (!promesa) {
      promesa = _cargarSupabase().then((supa) =>
        supa.createClient(CONFIG_SUPABASE.URL, CONFIG_SUPABASE.CLAVE)
      );
    }
    return promesa;
  };
})();

// --- Utilidades ---
const _textoDeError = (error) => {
  const m = {
    'Invalid login credentials': 'El correo o la contraseña no son correctos.',
    'User already registered': 'Ya existe una cuenta con ese correo.',
    'Email not confirmed': 'Revisa tu correo: la cuenta aún no está confirmada.',
    'Password should be at least 6 characters': 'La contraseña debe tener al menos 6 caracteres.',
  };
  return m[error?.message] || error?.message || 'Ocurrió un error inesperado.';
};


// ============================================================================
//  CUENTAS DE USUARIO
// ============================================================================

/**
 * Crea una cuenta. Supabase manda un correo de confirmación.
 * @returns {{ok: boolean, mensaje: string}}
 */
async function registrarUsuario(correo, password) {
  try {
    const sb = await clienteSupabase();
    const { data, error } = await sb.auth.signUp({
      email: correo.trim(),
      password,
    });
    if (error) return { ok: false, mensaje: _textoDeError(error) };
    return {
      ok: true,
      mensaje: data.session
        ? '¡Cuenta creada! Ya puedes completar tu perfil.'
        : '¡Cuenta creada! Revisa tu correo para confirmarla y luego inicia sesión.',
    };
  } catch (e) {
    return { ok: false, mensaje: _textoDeError(e) };
  }
}

/** Inicia sesión. */
async function iniciarSesion(correo, password) {
  try {
    const sb = await clienteSupabase();
    const { error } = await sb.auth.signInWithPassword({
      email: correo.trim(),
      password,
    });
    if (error) return { ok: false, mensaje: _textoDeError(error) };
    return { ok: true, mensaje: '¡Bienvenido de vuelta!' };
  } catch (e) {
    return { ok: false, mensaje: _textoDeError(e) };
  }
}

/** Cierra sesión. */
async function cerrarSesion() {
  try {
    const sb = await clienteSupabase();
    await sb.auth.signOut();
    return { ok: true };
  } catch (e) {
    return { ok: false, mensaje: _textoDeError(e) };
  }
}

/**
 * Usuario con sesión iniciada, o null.
 * @returns {Promise<{id: string, email: string}|null>}
 */
async function usuarioActual() {
  if (!SUPABASE_ACTIVO) return null;
  try {
    const sb = await clienteSupabase();
    const { data } = await sb.auth.getUser();
    return data?.user ? { id: data.user.id, email: data.user.email } : null;
  } catch {
    return null;
  }
}

/**
 * Se ejecuta con el usuario apenas se sabe quién es (o null si no hay sesión).
 * @param {(usuario: {id,email}|null) => void} fn
 */
async function alCambiarUsuario(fn) {
  if (!SUPABASE_ACTIVO) return fn(null);
  try {
    const sb = await clienteSupabase();
    const { data } = sb.auth.onAuthStateChange((_evento, sesion) => {
      fn(sesion?.user ? { id: sesion.user.id, email: sesion.user.email } : null);
    });
    return () => data.subscription.unsubscribe();
  } catch {
    return fn(null);
  }
}


// ============================================================================
//  PERFIL DEL ESTUDIANTE
// ============================================================================

/**
 * Lee el perfil del usuario indicado.
 * @returns {Promise<object|null>}
 */
async function leerPerfil(usuarioId) {
  if (!SUPABASE_ACTIVO || !usuarioId) return null;
  try {
    const sb = await clienteSupabase();
    const { data, error } = await sb
      .from(CONFIG_SUPABASE.TABLA_PERFILES)
      .select('*')
      .eq('id', usuarioId)
      .maybeSingle();
    if (error) throw error;
    return data;
  } catch (e) {
    console.error('[EstuTrabajo] No se pudo leer el perfil:', _textoDeError(e));
    return null;
  }
}

/**
 * Guarda el perfil. Crea la fila si no existía.
 * @returns {{ok: boolean, mensaje: string}}
 */
async function guardarPerfil(usuarioId, datos) {
  if (!SUPABASE_ACTIVO || !usuarioId) return { ok: false, mensaje: 'Sin sesión activa.' };
  try {
    const sb = await clienteSupabase();
    const { error } = await sb
      .from(CONFIG_SUPABASE.TABLA_PERFILES)
      .upsert({
        id: usuarioId,
        nombre: datos.nombre || '',
        estudios: datos.estudios || '',
        habilidades: datos.habilidades || '',
        disponibilidad: datos.disponibilidad || '',
        ciudad: datos.ciudad || '',
      });
    if (error) throw error;
    return { ok: true, mensaje: '¡Perfil guardado!' };
  } catch (e) {
    return { ok: false, mensaje: _textoDeError(e) };
  }
}

/** Borra los datos del perfil (no la cuenta). */
async function borrarPerfil(usuarioId) {
  if (!SUPABASE_ACTIVO || !usuarioId) return { ok: false, mensaje: 'Sin sesión activa.' };
  try {
    const sb = await clienteSupabase();
    const { error } = await sb
      .from(CONFIG_SUPABASE.TABLA_PERFILES)
      .update({ nombre: '', estudios: '', habilidades: '', disponibilidad: '', ciudad: '' })
      .eq('id', usuarioId);
    if (error) throw error;
    return { ok: true, mensaje: 'Perfil borrado' };
  } catch (e) {
    return { ok: false, mensaje: _textoDeError(e) };
  }
}


// ============================================================================
//  OFERTAS
// ============================================================================

/**
 * Carga todas las ofertas activas.
 * Si Supabase no está configurado o falla, devuelve null para que el sitio
 * siga usando los datos de js/ofertas.js.
 * @returns {Promise<Array|null>}
 */
async function cargarOfertas() {
  if (!SUPABASE_ACTIVO) return null;
  try {
    const sb = await clienteSupabase();
    const { data, error } = await sb
      .from(CONFIG_SUPABASE.TABLA_OFERTAS)
      .select('*')
      .eq('activa', true)
      .order('id');
    if (error) throw error;
    return data || [];
  } catch (e) {
    console.warn('[EstuTrabajo] No se pudieron cargar las ofertas:', _textoDeError(e));
    return null;
  }
}


// ============================================================================
//  POSTULACIONES
// ============================================================================

/** Las postulaciones del usuario, con el detalle de cada oferta. */
async function cargarPostulaciones(usuarioId) {
  if (!SUPABASE_ACTIVO || !usuarioId) return [];
  try {
    const sb = await clienteSupabase();
    const { data, error } = await sb
      .from(CONFIG_SUPABASE.TABLA_POSTULACIONES)
      .select('*, ofertas (id, puesto, empresa, ciudad, imagen)')
      .eq('usuario_id', usuarioId)
      .order('creado', { ascending: false });
    if (error) throw error;
    return data || [];
  } catch (e) {
    console.error('[EstuTrabajo] No se pudieron cargar tus postulaciones:', _textoDeError(e));
    return [];
  }
}

/** Postula al usuario a una oferta. */
async function postularse(usuarioId, ofertaId) {
  if (!SUPABASE_ACTIVO || !usuarioId) return { ok: false, mensaje: 'Inicia sesión para postularte.' };
  try {
    const sb = await clienteSupabase();
    const { error } = await sb
      .from(CONFIG_SUPABASE.TABLA_POSTULACIONES)
      .insert({ usuario_id: usuarioId, oferta_id: Number(ofertaId) });
    if (error) {
      if (String(error.message).includes('duplicate') || error.code === '23505') {
        return { ok: false, mensaje: 'Ya te postulaste a esta oferta.' };
      }
      throw error;
    }
    return { ok: true, mensaje: '¡Postulación enviada!' };
  } catch (e) {
    return { ok: false, mensaje: _textoDeError(e) };
  }
}

/** Cancela una postulación. */
async function cancelarPostulacion(usuarioId, ofertaId) {
  if (!SUPABASE_ACTIVO || !usuarioId) return { ok: false, mensaje: 'Inicia sesión primero.' };
  try {
    const sb = await clienteSupabase();
    const { error } = await sb
      .from(CONFIG_SUPABASE.TABLA_POSTULACIONES)
      .delete()
      .eq('usuario_id', usuarioId)
      .eq('oferta_id', Number(ofertaId));
    if (error) throw error;
    return { ok: true, mensaje: 'Postulación cancelada' };
  } catch (e) {
    return { ok: false, mensaje: _textoDeError(e) };
  }
}