// ============================================================================
//  auth.js — Panel de acceso: registro, inicio y cierre de sesión
// ============================================================================
//
//  Solo se usa en "mi-perfil.html".
//
//  Si Supabase no está configurado (js/config.js), este archivo se apaga
//  solo: esconde el panel de acceso y la web sigue como estaba, guardando
//  el perfil en el navegador.
// ============================================================================

document.addEventListener('DOMContentLoaded', () => {
  const panel = document.getElementById('panel-acceso');
  if (!panel) return;

  const mensaje = document.getElementById('acceso-mensaje');
  const bloqueSinSesion = document.getElementById('acceso-sin-sesion');
  const bloqueConSesion = document.getElementById('acceso-con-sesion');
  const correoSesion = document.getElementById('sesion-correo');

  const formulario = document.getElementById('formulario-acceso');
  const campoCorreo = document.getElementById('acceso-correo');
  const campoPassword = document.getElementById('acceso-password');
  const botonEntrar = document.getElementById('boton-entrar');
  const botonRegistro = document.getElementById('boton-registro');
  const botonSalir = document.getElementById('boton-salir');

  // Sin base de datos conectada: no mostramos el panel.
  if (!SUPABASE_ACTIVO) {
    panel.hidden = true;
    return;
  }

  panel.hidden = false;

  // ---- Avisos -------------------------------------------------------------

  let temporizadorAviso;

  function avisar(texto, tipo = 'info') {
    if (!mensaje) return;
    clearTimeout(temporizadorAviso);
    mensaje.textContent = texto;
    mensaje.dataset.tipo = tipo;
    if (texto) {
      temporizadorAviso = setTimeout(() => { mensaje.textContent = ''; }, 6000);
    }
  }

  function bloquear(activo) {
    [botonEntrar, botonRegistro, botonSalir].forEach((b) => { if (b) b.disabled = activo; });
    if (campoCorreo) campoCorreo.disabled = activo;
    if (campoPassword) campoPassword.disabled = activo;
  }

  // ---- Pintar el estado según haya sesión o no ---------------------------

  function pintar(usuario) {
    const dentro = Boolean(usuario);

    if (bloqueSinSesion) bloqueSinSesion.hidden = dentro;
    if (bloqueConSesion) bloqueConSesion.hidden = !dentro;
    if (correoSesion) correoSesion.textContent = usuario ? usuario.email : '';

    // Avisamos al resto de la página (perfil.js) qué usuario hay activo.
    document.dispatchEvent(new CustomEvent('estutrabajo:usuario', {
      detail: { usuario: usuario || null },
    }));
  }

  // ---- Entrar -------------------------------------------------------------

  if (formulario) {
    formulario.addEventListener('submit', async (evento) => {
      evento.preventDefault();

      const correo = campoCorreo?.value.trim() || '';
      const password = campoPassword?.value || '';

      if (!correo || !password) return;

      bloquear(true);
      avisar('Comprobando tus datos...');

      const r = await iniciarSesion(correo, password);
      avisar(r.mensaje, r.ok ? 'exito' : 'error');

      if (r.ok && campoPassword) campoPassword.value = '';

      bloquear(false);
    });
  }

  // ---- Crear cuenta -------------------------------------------------------

  if (botonRegistro) {
    botonRegistro.addEventListener('click', async () => {
      const correo = campoCorreo?.value.trim() || '';
      const password = campoPassword?.value || '';

      if (!correo) {
        avisar('Escribe primero tu correo electrónico.', 'error');
        return;
      }
      if (password.length < 6) {
        avisar('La contraseña debe tener al menos 6 caracteres.', 'error');
        return;
      }

      bloquear(true);
      avisar('Creando tu cuenta...');

      const r = await registrarUsuario(correo, password);
      avisar(r.mensaje, r.ok ? 'exito' : 'error');

      if (r.ok && campoPassword) campoPassword.value = '';

      bloquear(false);
    });
  }

  // ---- Cerrar sesión ------------------------------------------------------

  if (botonSalir) {
    botonSalir.addEventListener('click', async () => {
      bloquear(true);
      const r = await cerrarSesion();
      avisar(r.ok ? 'Sesión cerrada.' : r.mensaje, r.ok ? 'info' : 'error');
      bloquear(false);
    });
  }

  // ---- Escuchar cambios de sesión ----------------------------------------
  //  Supabase guarda la sesión en el navegador y la restaura solo, así que
  //  si el visitante ya estaba adentro, entramos en modo "con sesión".

  alCambiarUsuario((usuario) => {
    pintar(usuario);
    if (usuario) avisar('Sesión iniciada.', 'exito');
  });
});