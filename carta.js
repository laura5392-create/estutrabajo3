// ============================================================================
//  carta.js — Generador de carta de presentación
//
//  No usa IA: es una plantilla con campos que se rellenan con los datos de
//  "Mi perfil" y los de la oferta elegida. El texto es editable antes de
//  copiarlo, y la carta nunca se envía a ningún sitio.
// ============================================================================

document.addEventListener('DOMContentLoaded', () => {
  const boton = document.getElementById('abrir-carta');
  const modal = document.getElementById('modal-carta');
  if (!boton || !modal) return;

  const selOferta = document.getElementById('carta-oferta');
  const area = document.getElementById('carta-texto');
  const aviso = document.getElementById('carta-aviso');
  const btnCopiar = document.getElementById('carta-copiar');
  const btnLimpiar = document.getElementById('carta-limpiar');
  const contexto = document.getElementById('carta-contexto');

  // --------------------------------------------------------------------------
  // Datos del estudiante (mismos claves que perfil.js)
  // --------------------------------------------------------------------------

  const perfil = () => ({
    nombre:    (localStorage.getItem('perfil_nombre') || '').trim(),
    estudios:  (localStorage.getItem('perfil_estudios') || '').trim(),
    habilidades:(localStorage.getItem('perfil_habilidades') || '').trim(),
    disponibilidad: (localStorage.getItem('perfil_disponibilidad') || '').trim(),
  });

  const completar = (texto, valores) =>
    texto.replace(/\{(\w+)\}/g, (todo, clave) => (valores[clave] || todo));

  // --------------------------------------------------------------------------
  // Plantillas
  // --------------------------------------------------------------------------

  const PLANTILLAS = {
    carta: {
      etiqueta: 'Carta formal',
      texto: [
        'Asunto: Postulación a {puesto} — {empresa}',
        '',
        'Estimado equipo de {empresa}:',
        '',
        'Mi nombre es {nombre} y me dirijo a ustedes para proponer mi candidatura al puesto de {puesto}.',
        '',
        'Estudio {estudios} y mi disponibilidad es {disponibilidad}, asi puedo asumir el horario de esta oferta sin dejar atras mis estudios.',
        '',
        'Cuento con habilidades en {habilidades}, que es justo lo que el puesto necesita. Me comprometo a aportar en {tarea1}.',
        '',
        'Quedo atento a cualquier información adicional que necesiten y a la posibilidad de una entrevista.',
        '',
        'Muchas gracias por su tiempo.',
        '',
        '{nombre}',
      ].join('\n'),
    },
    correo: {
      etiqueta: 'Correo breve',
      texto: [
        'Hola,',
        '',
        'Escribo desde EstuTrabajo. Soy {nombre}, estudiante de {estudios}, y me interesa el puesto de {puesto} en {empresa}.',
        '',
        'Tengo disponibilidad de {disponibilidad} y manejo {habilidades}.',
        '',
        '¿Podemos agendar una conversación? Quedo atento.',
        '',
        'Gracias,',
        '{nombre}',
      ].join('\n'),
    },
    sinHabilidades: {
      etiqueta: 'Sin habilidades cargadas',
      texto: [
        'Asunto: Postulación a {puesto} — {empresa}',
        '',
        'Estimado equipo de {empresa}:',
        '',
        'Mi nombre es {nombre}. Me dirijo a ustedes para proponer mi candidatura al puesto de {puesto}.',
        '',
        'Estudio {estudios} y mi disponibilidad es {disponibilidad}.',
        '',
        'Quedo atento a cualquier información adicional y a la posibilidad de una entrevista.',
        '',
        'Muchas gracias por su tiempo.',
        '',
        '{nombre}',
      ].join('\n'),
    },
  };

  // --------------------------------------------------------------------------
  // Valores de la carta
  // --------------------------------------------------------------------------

  function valoresDe(indiceOferta) {
    const p = perfil();
    const oferta = OFERTAS[indiceOferta];

    return {
      puesto: oferta ? oferta.puesto : 'el puesto',
      empresa: oferta ? oferta.empresa : 'la empresa',
      tarea1: oferta && oferta.tareas && oferta.tareas[0]
        ? oferta.tareas[0].replace(/\.$/, '').toLowerCase()
        : 'el equipo',
      nombre: p.nombre || 'tu nombre',
      estudios: p.estudios || 'tu carrera',
      habilidades: p.habilidades || 'lo que estoy aprendiendo',
      disponibilidad: p.disponibilidad || 'la que me indique',
    };
  }

  function generar() {
    const indice = parseInt(selOferta.value, 10);
    const p = perfil();

    // Si no hay habilidades en el perfil, usamos la plantilla corta.
    const clave = p.habilidades ? 'carta' : 'sinHabilidades';
    let texto = PLANTILLAS[clave].texto;

    texto = completar(texto, valoresDe(indice));

    area.value = texto;

    if (contexto) {
      const faltan = [];
      if (!p.nombre) faltan.push('nombre');
      if (!p.estudios) faltan.push('estudios');
      if (!p.disponibilidad) faltan.push('disponibilidad');

      contexto.hidden = faltan.length === 0;
      contexto.textContent = faltan.length
        ? 'Completa ' + faltan.join(', ') + ' en tu perfil para que la carta quede completa.'
        : '';
    }

    aviso.textContent = '';
  }

  // --------------------------------------------------------------------------
  // Abrir / cerrar
  // --------------------------------------------------------------------------

  let previo = null;

  function abrir(indiceOferta) {
    previo = document.activeElement;

    // Llenar el selector con las ofertas que existen
    if (!selOferta.options.length) {
      Object.keys(OFERTAS).forEach((clave) => {
        const opcion = document.createElement('option');
        opcion.value = clave;
        opcion.textContent = OFERTAS[clave].puesto + ' — ' + OFERTAS[clave].empresa;
        selOferta.appendChild(opcion);
      });
    }

    if (indiceOferta !== undefined && indiceOferta !== null) {
      selOferta.value = String(indiceOferta);
    }

    generar();

    modal.hidden = false;
    document.body.classList.add('no-scroll');
    requestAnimationFrame(() => modal.classList.add('visible'));
    area.focus();
  }

  function cerrar() {
    modal.classList.remove('visible');
    document.body.classList.remove('no-scroll');
    setTimeout(() => { modal.hidden = true; }, 220);
    if (previo && previo.focus) previo.focus();
  }

  // --------------------------------------------------------------------------
  // Eventos
  // --------------------------------------------------------------------------

  boton.addEventListener('click', () => abrir());
  if (selOferta) selOferta.addEventListener('change', generar);

  modal.querySelectorAll('[data-cerrar-carta]').forEach((n) => {
    n.addEventListener('click', cerrar);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modal.hidden) cerrar();
  });

  if (btnCopiar) {
    btnCopiar.addEventListener('click', async () => {
      const texto = area.value;
      if (!texto) return;

      try {
        await navigator.clipboard.writeText(texto);
        aviso.textContent = 'Carta copiada. Ya puedes pegarla en tu correo.';
      } catch (e) {
        // Sin permiso de portapapeles: al menos seleccionamos todo.
        area.select();
        aviso.textContent = 'Seleccioné todo el texto. Pulsa Ctrl+C para copiar.';
      }
      aviso.hidden = false;
    });
  }

  if (btnLimpiar) {
    btnLimpiar.addEventListener('click', generar);
  }

  // El modal de detalle pide abrir la carta para una oferta concreta.
  document.addEventListener('estutrabajo:carta', (evento) => {
    abrir(evento.detail && evento.detail.indice);
  });
});
