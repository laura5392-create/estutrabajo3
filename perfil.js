// ============================================================================
//  perfil.js — Formulario de perfil: vista previa en vivo + persistencia
// ============================================================================
//
//  Solo se usa en "mi-perfil.html".
//
//  Cómo decide dónde guardar:
//    · Si hay sesión iniciada  -> guarda en Supabase (se ve en cualquier
//                                celular o computador, no se pierde).
//    · Si no la hay            -> guarda en localStorage como antes, para que
//                                la web siga siendo usable sin configurar nada.
//    · Con sesión, si algo falla -> avisa y NO borra el contenido del formulario.
//
//  Mientras Supabase no esté configurado, este archivo se comporta exactamente
//  como el anterior.
// ============================================================================

document.addEventListener('DOMContentLoaded', () => {
  const formulario = document.getElementById('formulario-perfil');
  if (!formulario) return;

  const CAMPOS = [
    { id: 'nombre',         destino: 'vista-nombre',         vacio: 'Tu nombre...' },
    { id: 'estudios',       destino: 'vista-estudios',       vacio: 'Lo que estudias' },
    { id: 'habilidades',    destino: 'vista-habilidades',    vacio: 'Tus habilidades' },
    { id: 'disponibilidad', destino: 'vista-disponibilidad', vacio: 'Tu disponibilidad' },
  ];

  const clave = (id) => 'perfil_' + id;

  // Usuario con sesión (o null si no hay). auth.js lo actualiza.
  let usuario = null;

  // Mensaje de estado junto al botón de guardar.
  const aviso = document.getElementById('aviso-perfil');

  function mostrarAviso(texto, tipo = 'info') {
    if (!aviso) return;
    aviso.textContent = texto;
    aviso.dataset.tipo = tipo;
    if (texto) setTimeout(() => { if (aviso.textContent === texto) aviso.textContent = ''; }, 5000);
  }

  // --------------------------------------------------------------------------
  //  Vista previa en vivo
  // --------------------------------------------------------------------------

  const refrescar = ({ id, destino, vacio }) => {
    const entrada = document.getElementById(id);
    const salida = document.getElementById(destino);
    if (!entrada || !salida) return;

    const valor = entrada.value.trim();
    salida.textContent = valor;
    salida.classList.toggle('vacio', valor === '');

    // Guardado automático local: sirve de copia de seguridad aunque no haya
    // sesión, y es lo que rellena el formulario mientras se espera la base.
    if (valor) {
      localStorage.setItem(clave(id), entrada.value);
    } else {
      localStorage.removeItem(clave(id));
    }
  };

  CAMPOS.forEach((campo) => {
    const entrada = document.getElementById(campo.id);
    if (!entrada) return;

    // Restaurar el valor guardado en el navegador
    const guardado = localStorage.getItem(clave(campo.id));
    if (guardado) entrada.value = guardado;

    entrada.addEventListener('input', () => refrescar(campo));
    entrada.addEventListener('blur', () => refrescar(campo));
    refrescar(campo);
  });

  // --------------------------------------------------------------------------
  //  Cargar el perfil desde la base de datos
  // --------------------------------------------------------------------------

  async function cargarDesdeBase(usu) {
    const perfil = await leerPerfil(usu.id);
    if (!perfil) return;

    CAMPOS.forEach(({ id }) => {
      const entrada = document.getElementById(id);
      const valor = (perfil[id] || '').trim();
      if (entrada && valor) entrada.value = perfil[id];
    });

    CAMPOS.forEach(refrescar);

    // Ocultar el aviso si el visitante no tiene nada guardado todavía.
    if (!localStorage.getItem('perfil_migrado')) {
      const tieneAlgo = CAMPOS.some(({ id }) => (document.getElementById(id)?.value || '').trim());
      if (tieneAlgo) {
        mostrarAviso('Recuperamos tu perfil de la nube.', 'exito');
        localStorage.setItem('perfil_migrado', '1');
      }
    }
  }

  document.addEventListener('estutrabajo:usuario', (evento) => {
    usuario = evento.detail?.usuario || null;
    if (usuario) cargarDesdeBase(usuario);
  });

  // --------------------------------------------------------------------------
  //  Guardar
  // --------------------------------------------------------------------------

  const botonGuardar = formulario.querySelector('button[type="submit"]');

  formulario.addEventListener('submit', async (evento) => {
    evento.preventDefault();

    const valores = {};
    CAMPOS.forEach(({ id }) => {
      const entrada = document.getElementById(id);
      const valor = entrada ? entrada.value.trim() : '';
      valores[id] = valor;

      if (entrada) {
        if (valor) localStorage.setItem(clave(id), entrada.value);
        else localStorage.removeItem(clave(id));
      }
    });

    // --- Sin sesión: localStorage (comportamiento original) ---
    if (!usuario) {
      animarBoton(botonGuardar, '¡Perfil guardado!');
      mostrarAviso(
        SUPABASE_ACTIVO
          ? 'Guardado en este navegador. Crea tu cuenta para guardarlo en la nube.'
          : 'Perfil guardado en este navegador.',
        'info'
      );
      return;
    }

    // --- Con sesión: base de datos ---
    if (botonGuardar) botonGuardar.disabled = true;
    mostrarAviso('Guardando en la nube...');

    const r = await guardarPerfil(usuario.id, valores);

    if (botonGuardar) botonGuardar.disabled = false;

    mostrarAviso(r.mensaje, r.ok ? 'exito' : 'error');
    if (r.ok) animarBoton(botonGuardar, '¡Perfil guardado!');
  });

  function animarBoton(boton, texto) {
    if (!boton) return;
    const original = boton.textContent;
    boton.textContent = texto;
    boton.classList.add('boton-exito');
    boton.disabled = true;
    setTimeout(() => {
      boton.textContent = original;
      boton.classList.remove('boton-exito');
      boton.disabled = false;
    }, 2200);
  }

  // --------------------------------------------------------------------------
  //  Limpiar perfil
  // --------------------------------------------------------------------------

  const botonLimpiar = document.getElementById('limpiar-perfil');

  if (botonLimpiar) {
    botonLimpiar.addEventListener('click', async () => {
      const confirmacion = window.confirm(
        '¿Seguro que quieres borrar los datos de tu perfil? Esta acción no se puede deshacer.'
      );
      if (!confirmacion) return;

      CAMPOS.forEach(({ id, destino, vacio }) => {
        const entrada = document.getElementById(id);
        const salida = document.getElementById(destino);

        if (entrada) entrada.value = '';
        localStorage.removeItem(clave(id));

        if (salida) {
          salida.textContent = vacio;
          salida.classList.add('vacio');
        }
      });

      if (usuario) {
        const r = await borrarPerfil(usuario.id);
        mostrarAviso(r.mensaje || 'Perfil borrado', r.ok ? 'exito' : 'error');
        if (!r.ok) return;
      } else {
        mostrarAviso('Perfil borrado en este navegador.', 'info');
      }

      const original = 'Limpiar';
      botonLimpiar.textContent = 'Perfil borrado';
      botonLimpiar.classList.add('boton-exito');

      setTimeout(() => {
        botonLimpiar.textContent = original;
        botonLimpiar.classList.remove('boton-exito');
      }, 1800);
    });
  }
});