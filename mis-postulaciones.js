// ============================================================================
//  mis-postulaciones.js — Lista tus postulaciones y permite cancelar
// ============================================================================
//
//  Solo se usa en "mi-perfil.html".
//  Si Supabase no está configurado, el bloque se esconde y no pasa nada.
// ============================================================================

document.addEventListener('DOMContentLoaded', () => {
  const seccion = document.getElementById('mis-postulaciones');
  if (!seccion) return;

  const lista = document.getElementById('lista-postulaciones');
  const mensaje = document.getElementById('postulaciones-mensaje');

  if (!SUPABASE_ACTIVO) {
    seccion.hidden = true;
    return;
  }

  seccion.hidden = false;

  const ESTADOS = {
    enviada:     { texto: 'Enviada',       clase: 'estado-enviada' },
    en_revision: { texto: 'En revisión',   clase: 'estado-revision' },
    aceptada:    { texto: 'Aceptada',      clase: 'estado-aceptada' },
    rechazada:   { texto: 'No seleccionada', clase: 'estado-rechazada' },
  };

  // --- Dibujar ------------------------------------------------------------

  function pintar(datos) {
    lista.innerHTML = '';

    if (!datos.length) {
      lista.innerHTML =
        '<li class="postulacion-vacia">' +
        'Todavía no te has postulado a ninguna oferta. ' +
        '<a href="buscar-empleos.html">Ver ofertas disponibles</a>.' +
        '</li>';
      return;
    }

    datos.forEach((p) => {
      const oferta = p.ofertas || {};
      const estado = ESTADOS[p.estado] || ESTADOS.enviada;

      const li = document.createElement('li');
      li.className = 'postulacion';

      const imagen = document.createElement('img');
      imagen.className = 'postulacion-imagen';
      imagen.src = oferta.imagen || 'img/ofertas/ventas.svg';
      imagen.alt = oferta.imagen_alt || oferta.puesto || '';
      imagen.loading = 'lazy';
      imagen.width = 56;
      imagen.height = 56;

      const cuerpo = document.createElement('div');
      cuerpo.className = 'postulacion-cuerpo';

      const titulo = document.createElement('strong');
      titulo.textContent = oferta.puesto || 'Oferta eliminada';

      const empresa = document.createElement('span');
      empresa.className = 'postulacion-empresa';
      empresa.textContent = [oferta.empresa, oferta.ciudad].filter(Boolean).join(' · ');

      const fecha = document.createElement('time');
      fecha.className = 'postulacion-fecha';
      fecha.dateTime = p.creado;
      fecha.textContent = 'Postulada el ' + new Date(p.creado).toLocaleDateString('es-CO');

      cuerpo.append(titulo, empresa, fecha);

      const etiqueta = document.createElement('span');
      etiqueta.className = 'postulacion-estado ' + estado.clase;
      etiqueta.textContent = estado.texto;

      const cancelar = document.createElement('button');
      cancelar.type = 'button';
      cancelar.className = 'boton boton-ghost boton-chico';
      cancelar.textContent = 'Cancelar';
      cancelar.addEventListener('click', async () => {
        if (!window.confirm('¿Cancelar esta postulación?')) return;

        cancelar.disabled = true;
        const r = await cancelarPostulacion(usuarioIdActual, p.oferta_id);

        if (r.ok) {
          mostrarMensaje(r.mensaje, 'exito');
          await cargar();
        } else {
          mostrarMensaje(r.mensaje, 'error');
          cancelar.disabled = false;
        }
      });

      li.append(imagen, cuerpo, etiqueta, cancelar);
      lista.appendChild(li);
    });
  }

  function mostrarMensaje(texto, tipo = 'info') {
    if (!mensaje) return;
    mensaje.textContent = texto;
    mensaje.dataset.tipo = tipo;
    if (texto) setTimeout(() => { if (mensaje.textContent === texto) mensaje.textContent = ''; }, 5000);
  }

  // --- Cargar -------------------------------------------------------------

  let usuarioIdActual = null;

  async function cargar() {
    if (!usuarioIdActual) {
      pintar([]);
      mostrarMensaje('Inicia sesión para ver tus postulaciones.', 'info');
      return;
    }
    pintar(await cargarPostulaciones(usuarioIdActual));
  }

  document.addEventListener('estutrabajo:usuario', (evento) => {
    usuarioIdActual = evento.detail?.usuario?.id || null;
    cargar();
  });

  cargar();
});