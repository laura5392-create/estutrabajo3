// ============================================================================
// -postular.js — Botón "Inscribirme" conectado a la base de datos
// ============================================================================
//
//  Solo se usa en "buscar-empleos.html".
//
//  Qué hace:
//    · Sin Supabase configurado -> no se toca nada, el enlace sigue siendo
//      un enlace normal hacia la página de perfil.
//    · Con Supabase  -> al hacer clic, guarda la postulación del estudiante
//      en la tabla "postulaciones". Si no hay sesión, lleva a crear la cuenta.
//
//  La relación entre la tarjeta y la oferta en la base de datos es la misma
//  que ya usa el resto del proyecto: el índice de la tarjeta + 1. El archivo
//  sql/semilla.sql carga las ofertas en ese mismo orden.
// ============================================================================

document.addEventListener('DOMContentLoaded', () => {
  if (!SUPABASE_ACTIVO) return; // Modo sin base de datos: comportamiento original

  const lista = document.getElementById('lista-empleos');
  if (!lista) return;

  // --- Estado del usuario -------------------------------------------------
  //  Esta página no tiene el panel de acceso, así que nos suscribimos
  //  directamente a Supabase para saber si hay alguien con sesión.

  let usuario = null;

  alCambiarUsuario((u) => {
    if (u?.id === usuario?.id) return;
    usuario = u;
    pintarPostulaciones();
  });

  // --- Las postulaciones ya hechas ---------------------------------------

  let hechas = new Set(); // ids de ofertaYa postuladas

  async function pintarPostulaciones() {
    if (!usuario) {
      hechas = new Set();
      return;
    }
    const listaPost = await cargarPostulaciones(usuario.id);
    hechas = new Set(
      listaPost.map((p) => Number(p.oferta_id))
    );
    marcar();
  }

  // --- Pintar el estado de cada botón ------------------------------------

  function marcar() {
    lista.querySelectorAll('.inscribirme').forEach((boton) => {
      const tarjeta = boton.closest('.empleo');
      if (!tarjeta) return;

      const id = Number(tarjeta.dataset.indice) + 1;

      if (hechas.has(id)) {
        boton.textContent = 'Ya te postulaste';
        boton.classList.add('postulado');
        boton.title = 'Puedes cancelar tu postulación desde Mi perfil';
      } else {
        boton.textContent = 'Inscribirme';
        boton.classList.remove('postulado');
        boton.title = '';
      }
    });
  }

  // --- Clic en "Inscribirme" ---------------------------------------------

  lista.addEventListener('click', async (evento) => {
    const boton = evento.target.closest('.inscribirme');
    if (!boton) return;

    const tarjeta = boton.closest('.empleo');
    if (!tarjeta) return;

    const indice = Number(tarjeta.dataset.indice);
    if (Number.isNaN(indice)) return;

    const idOferta = indice + 1;
    const puesto = tarjeta.querySelector('.titulo-empleo')?.textContent.trim() || 'esta oferta';

    // Sin sesión: a crear la cuenta.
    if (!usuario) {
      evento.preventDefault();
      const destino = `mi-perfil.html#postular=${idOferta}`;
      window.location.href = destino;
      return;
    }

    // Ya_postulado: no hacemos nada, se gestiona desde Mi perfil.
    if (hechas.has(idOferta)) return;

    evento.preventDefault();

    boton.disabled = true;
    const textoOriginal = boton.textContent;
    boton.textContent = 'Enviando...';

    const r = await postularse(usuario.id, idOferta);

    if (r.ok) {
      hechas.add(idOferta);
      marcar();
      avisar('¡Postulación enviada! Te desiremos suerte con ' + puesto + '.', 'exito');
    } else {
      boton.textContent = textoOriginal;
      avisar(r.mensaje, 'error');
    }

    boton.disabled = false;
  });

  // --- Aviso flotante ----------------------------------------------------

  let avisoEl = null;
  let temporizadorAviso;

  function avisar(texto, tipo = 'info') {
    if (!avisoEl) {
      avisoEl = document.createElement('div');
      avisoEl.className = 'aviso-postular';
      avisoEl.setAttribute('role', 'status');
      document.body.appendChild(avisoEl);
    }

    clearTimeout(temporizadorAviso);
    avisoEl.textContent = texto;
    avisoEl.dataset.tipo = tipo;
    avisoEl.classList.add('visible');

    temporizadorAviso = setTimeout(() => {
      avisoEl.classList.remove('visible');
    }, 4000);
  }

  pintarPostulaciones();
});