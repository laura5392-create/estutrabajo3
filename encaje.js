// ============================================================================
//  encaje.js — Calculadora de compatibilidad horaria y afinidad con el perfil
//
//  Responde a la pregunta que la web promete resolver pero no calculaba:
//  ¿esta oferta cabe de verdad con las horas que tienes libres de clases?
//
//  Dos puntajes independientes, ambos 0–100:
//    · Encaje   → de OFERTAS[i].disponibilidad contra tus bloques libres
//    · Afinidad → de tus habilidades (Mi perfil) contra OFERTAS[i].habilidades
//
//  Es una estimación declarativa, no un motor de reglas laborales.
// ============================================================================

const CLAVE_DISPONIBILIDAD = 'encaje_disponibilidad';

// Nombres legibles, para el aria-label de cada botón de la retícula
const DIAS_ES = ['lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado', 'domingo'];
const FRANJAS_ES = ['mañana', 'tarde', 'noche'];

const capitalizar = (s) => s.charAt(0).toUpperCase() + s.slice(1);

document.addEventListener('DOMContentLoaded', () => {
  const panel = document.getElementById('panel-encaje');
  if (!panel) return;

  const desplegable = document.getElementById('encaje-desplegable');
  const subtitulo = document.getElementById('encaje-subtitulo');
  const cuenta = document.getElementById('encaje-cuento');
  const avisoVacio = document.getElementById('encaje-vacio');
  const botonLimpiar = document.getElementById('encaje-limpiar');

  // La retícula (21 botones) se genera desde las constantes de ofertas.js:
  // así el HTML solo lleva los encabezados y no hay que mantener 21 <button>.
  const tabla = panel.querySelector('.encaje-tabla');

  FRANJAS.forEach((franja) => {
    DIAS.forEach((dia) => {
      const boton = document.createElement('button');
      boton.type = 'button';
      boton.className = 'encaje-franja';
      boton.dataset.dia = dia;
      boton.dataset.franja = franja;
      boton.setAttribute('aria-pressed', 'false');
      boton.setAttribute('aria-label',
        capitalizar(DIAS_ES[DIAS.indexOf(dia)]) + ' por la ' + FRANJAS_ES[FRANJAS.indexOf(franja)]);
      tabla.appendChild(boton);
    });
  });

  const opciones = Array.from(tabla.querySelectorAll('.encaje-franja'));
  const fichas = Array.from(document.querySelectorAll('.empleo'));

  const formatearNumero = (n) => n.toLocaleString('es-CO');

  // --------------------------------------------------------------------------
  // Estado: bloques libres que ha marcado el estudiante
  // --------------------------------------------------------------------------

  let libres = new Set();

  try {
    const guardado = JSON.parse(localStorage.getItem(CLAVE_DISPONIBILIDAD) || '[]');
    if (Array.isArray(guardado)) libres = new Set(guardado);
  } catch (e) {
    // localStorage bloqueado o datos corruptos: seguimos sin disponibilidad
  }

  const guardar = () => {
    try {
      localStorage.setItem(CLAVE_DISPONIBILIDAD, JSON.stringify([...libres]));
    } catch (e) {
      /* sin persistencia: la calculadora funciona igual, solo no recuerda */
    }
  };

  const alternar = (clave) => {
    if (libres.has(clave)) libres.delete(clave);
    else libres.add(clave);
    guardar();
    pintar();
    recalcular();
  };

  // --------------------------------------------------------------------------
  // Puntaje de encaje horario
  // --------------------------------------------------------------------------

  // Una oferta puede pedir varios tramos. Los declaramos como pares día/franja.
  function tramosRequeridos(datos) {
    const tramos = [];

    if (datos.disponibilidad) {
      const { dias, franja } = datos.disponibilidad;
      (dias || []).forEach((dia) => tramos.push({ dia, franja }));
    }

    if (datos.disponibilidadExtra) {
      Object.keys(datos.disponibilidadExtra).forEach((dia) => {
        tramos.push({ dia, franja: datos.disponibilidadExtra[dia] });
      });
    }

    return tramos;
  }

  function puntajeEncaje(datos) {
    const tramos = tramosRequeridos(datos);
    if (!tramos.length || libres.size === 0) return null;

    // La clave es siempre "dia:franja" (por ejemplo "lun:tarde").
    // Debe coincidir con la que construye alternar() y con la que guardamos.
    const clave = (dia, franja) => dia + ':' +franja;

    // Un fin de semana libre cubre el mismo tramo en el otro día del fin de semana.
    const libreEquivalente = (dia, franja) =>
      libres.has(clave(dia, franja)) ||
      (dia === 'sab' && libres.has(clave('dom', franja))) ||
      (dia === 'dom' && libres.has(clave('sab', franja)));

    let cubiertos = 0;
    tramos.forEach((t) => {
      if (libreEquivalente(t.dia, t.franja)) cubiertos += 1;
    });

    return Math.round((cubiertos / tramos.length) * 100);
  }

  // --------------------------------------------------------------------------
  // Puntaje de afinidad con el perfil
  // --------------------------------------------------------------------------

  const normalizar = (t) =>
    t
      .toLowerCase()
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '');

  function misHabilidades() {
    const guardado = localStorage.getItem('perfil_habilidades') || '';
    return normalizar(guardado)
      .split(/[,;\n]/)
      .map((s) => s.trim())
      .filter(Boolean);
  }

  function puntajeAfinidad(datos) {
    const minhas = misHabilidades();
    if (!minhas.length || !datos.habilidades || !datos.habilidades.length) return null;

    // Coincidencia por palabra completa, no por subcadena ("caja" dentro de "cajera").
    const aceptadas = datos.habilidades.map(normalizar);
    const halladas = [];

    misHabilidades.forEach((mía) => {
      const palabras = mía.split(/\s+/).filter((p) => p.length >= 3);
      const acierto = aceptadas.some((requerida) =>
        palabras.some((p) => requerida.includes(p))
      );
      if (acierto) halladas.push(mía);
    });

    if (!halladas.length) return 0;

    // Escala suave: 1 habilidad ya puntúa, 3 o más satura el valor.
    return Math.min(100, Math.round((halladas.length / 3) * 100));
  }

  // --------------------------------------------------------------------------
  // Pintar la retícula y los marcadores
  // --------------------------------------------------------------------------

  function pintar() {
    opciones.forEach((opcion) => {
      const activo = libres.has(opcion.dataset.dia + ':' + opcion.dataset.franja);
      opcion.classList.toggle('activo', activo);
      opcion.setAttribute('aria-pressed', String(activo));
    });

    const n = libres.size;
    if (avisoVacio) avisoVacio.hidden = n > 0;
    if (botonLimpiar) botonLimpiar.hidden = n === 0;
  }

  function recalcular() {
    const propias = misHabilidades();
    let conEncaje = 0;
    let mejor = 0;

    fichas.forEach((ficha) => {
      const datos = OFERTAS[Number(ficha.dataset.indice)];
      if (!datos) return;

      const anterior = ficha.querySelector('.puntaje-encaje');
      if (anterior) anterior.remove();

      const encaje = puntajeEncaje(datos);
      const afinidad = puntajeAfinidad(datos);

      if (encaje !== null) {
        conEncaje += 1;
        if (encaje > mejor) mejor = encaje;

        const marca = document.createElement('span');
        marca.className = 'puntaje-encaje';
        if (encaje >= 80) marca.classList.add('alto');
        else if (encaje >= 50) marca.classList.add('medio');
        else marca.classList.add('bajo');

        marca.textContent = encaje + '% encaja';
        ficha.dataset.encaje = String(encaje);

        // Va dentro de la ilustración; si aún no existe, al inicio de la tarjeta.
        const imagen = ficha.querySelector('.empleo-imagen');
        if (imagen) imagen.appendChild(marca);
        else ficha.insertBefore(marca, ficha.firstChild);
      } else {
        delete ficha.dataset.encaje;
      }

      // Afinidad, como badge de texto junto al título.
      const badgePrevio = ficha.querySelector('.puntaje-afinidad');
      if (badgePrevio) badgePrevio.remove();

      if (afinidad !== null && afinidad > 0) {
        const chip = document.createElement('span');
        chip.className = 'puntaje-afinidad';
        chip.textContent = afinidad + '% afinidad con tu perfil';
        ficha.dataset.afinidad = String(afinidad);

        const etiquetas = ficha.querySelector('.etiquetas-trabajo');
        if (etiquetas) etiquetas.appendChild(chip);
      } else {
        delete ficha.dataset.afinidad;
      }
    });

    // Resumen
    if (cuenta) {
      if (libres.size === 0) {
        cuenta.hidden = true;
      } else {
        cuenta.hidden = false;
        cuenta.textContent = conEncaje + ' de ' + fichas.length;
      }
    }

    if (subtitulo) {
      if (libres.size === 0) {
        subtitulo.textContent = 'Marca cuando estás libre y te digo qué tanto te sirve cada puesto.';
      } else if (propias.length) {
        subtitulo.textContent =
          'Con ' + libres.size + ' bloque' + (libres.size === 1 ? '' : 's') + ' libres. ' +
          'Mejor encaje: ' + mejor + '%.';
      } else {
        subtitulo.textContent =
          'Con ' + libres.size + ' bloque' + (libres.size === 1 ? '' : 's') + ' libres. ' +
          'Mejor encaje: ' + mejor + '%. Añade habilidades en tu perfil para medir la afinidad.';
      }
    }

    // Ordenar por encaje, si existe la opción
    const selectOrden = document.getElementById('ordenar');
    if (selectOrden && !selectOrden.querySelector('option[value="encaje"]')) {
      const opcion = document.createElement('option');
      opcion.value = 'encaje';
      opcion.textContent = 'Mejor encaje con tus horas';
      selectOrden.appendChild(opcion);
    }
  }

  // --------------------------------------------------------------------------
  // Eventos
  // --------------------------------------------------------------------------

  opciones.forEach((opcion) => {
    opcion.addEventListener('click', () => alternar(opcion.dataset.dia + ':' + opcion.dataset.franja));
  });

  if (botonLimpiar) {
    botonLimpiar.addEventListener('click', () => {
      libres = new Set();
      guardar();
      pintar();
      recalcular();
    });
  }

  // Si ya hay disponibilidad guardada, se abre el panel para que se vea el resultado.
  if (desplegable && libres.size > 0) desplegable.open = true;

  pintar();
  recalcular();
});