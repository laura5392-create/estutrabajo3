// ============================================================================
//  empleos.js — Filtros, orden, carga progresiva y modal de detalle
//  Solo se usa en "buscar-empleos.html"
//  Los datos de cada puesto vienen de ofertas.js
// ============================================================================

document.addEventListener('DOMContentLoaded', () => {
  const lista = document.getElementById('lista-empleos');
  if (!lista) return;

  const els = {
    tipo:      document.getElementById('filtro-tipo'),
    ciudad:    document.getElementById('filtro-ciudad'),
    horario:   document.getElementById('filtro-horario'),
    busqueda:  document.getElementById('filtro-busqueda'),
    ordenar:   document.getElementById('ordenar'),
    contador:  document.getElementById('resultados'),
    cantidad:  document.getElementById('resultados-cantidad'),
    vacio:     document.getElementById('sin-resultados'),
    limpiar:   document.getElementById('limpiar-filtros'),
    cargarMas: document.getElementById('cargar-mas'),
  };

  const todasLasOfertas = Array.from(lista.querySelectorAll('.empleo'));
  const TAMANO_PAGINA = 8;
  let paginaActual = 1;

  // --------------------------------------------------------------------------
  // Metadatos derivados del contenido de cada tarjeta
  // (evita duplicar datos en atributos data-* del HTML)
  // --------------------------------------------------------------------------

  const DIAS_REGEX = /hace\s+(\d+)\s+d[ií]a/i;

  const normalizar = (texto) =>
    texto
      .toLowerCase()
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '');

  const aNumero = (txt) => parseInt(String(txt).replace(/\./g, ''), 10) || 0;

  todasLasOfertas.forEach((oferta, indice) => {
    const fecha = oferta.querySelector('.fecha');
    const titulo = oferta.querySelector('.titulo-empleo');
    const empresa = oferta.querySelector('.empresa strong');
    const salario = oferta.querySelector('.salario strong');

    const textoFecha = fecha ? fecha.textContent : '';
    const dias = textoFecha.match(DIAS_REGEX);

    oferta.dataset.indice = String(indice);
    // "Hoy" = 0 días, así que el orden natural del HTML es por antigüedad
    oferta.dataset.dias = dias ? dias[1] : '0';
    oferta.dataset.salario = salario ? String(aNumero(salario.textContent)) : '0';

    const nombreEmpresa = empresa ? empresa.textContent.trim() : '';
    oferta.dataset.empresa = normalizar(nombreEmpresa);

    oferta.dataset.buscable = normalizar(
      oferta.textContent + ' ' + (titulo ? titulo.textContent : '') + ' ' + nombreEmpresa
    );
  });

  // --------------------------------------------------------------------------
  // Filtrado
  // --------------------------------------------------------------------------

  function coincide(oferta) {
    const tipo = els.tipo ? els.tipo.value : '';
    const ciudad = els.ciudad ? els.ciudad.value : '';
    const horario = els.horario ? els.horario.value : '';
    const texto = normalizar(els.busqueda ? els.busqueda.value : '').trim();

    if (tipo && oferta.dataset.tipo !== tipo) return false;
    if (ciudad && oferta.dataset.ciudad !== ciudad) return false;
    if (horario && oferta.dataset.horario !== horario) return false;
    if (texto && !oferta.dataset.buscable.includes(texto)) return false;

    return true;
  }

  // --------------------------------------------------------------------------
  // Orden
  // --------------------------------------------------------------------------

  const ORDENADORES = {
    relevancia:     (a, b) => a.dataset.indice - b.dataset.indice,
    recientes:      (a, b) => a.dataset.dias - b.dataset.dias,
    antiguas:       (a, b) => b.dataset.dias - a.dataset.dias,
    'salario-alto': (a, b) => b.dataset.salario - a.dataset.salario,
    'salario-bajo': (a, b) => a.dataset.salario - b.dataset.salario,
    empresa:        (a, b) => a.dataset.empresa.localeCompare(b.dataset.empresa, 'es'),
  };

  function ordenar() {
    const criterio = els.ordenar ? els.ordenar.value : 'relevancia';
    const comparador = ORDENADORES[criterio] || ORDENADORES.relevancia;
    todasLasOfertas.slice().sort(comparador).forEach((o) => lista.appendChild(o));
  }

  // --------------------------------------------------------------------------
  // Render: aplica filtros + muestra solo la página actual
  // --------------------------------------------------------------------------

  function aplicar({ reiniciarPagina = true } = {}) {
    if (reiniciarPagina) paginaActual = 1;

    let coincidencias = 0;
    let mostradas = 0;

    todasLasOfertas.forEach((oferta) => {
      if (!coincide(oferta)) {
        oferta.hidden = true;
        return;
      }
      coincidencias += 1;
      if (mostradas < paginaActual * TAMANO_PAGINA) {
        oferta.hidden = false;
        mostradas += 1;
      } else {
        oferta.hidden = true;
      }
    });

    if (els.cantidad) els.cantidad.textContent = String(coincidencias);
    if (els.contador) {
      els.contador.innerHTML =
        '<strong>' + coincidencias + '</strong> ' +
        (coincidencias === 1 ? 'oferta disponible' : 'ofertas disponibles');
    }

    if (els.vacio) els.vacio.hidden = coincidencias > 0;
    if (els.cargarMas) els.cargarMas.hidden = mostradas >= coincidencias;
  }

  // --------------------------------------------------------------------------
  // Eventos de filtros, orden y carga
  // --------------------------------------------------------------------------

  [els.tipo, els.ciudad, els.horario].forEach((control) => {
    if (control) control.addEventListener('change', () => aplicar());
  });

  if (els.busqueda) {
    let temporizador;
    els.busqueda.addEventListener('input', () => {
      clearTimeout(temporizador);
      temporizador = setTimeout(() => aplicar(), 150);
    });
  }

  if (els.ordenar) {
    els.ordenar.addEventListener('change', () => {
      ordenar();
      aplicar({ reiniciarPagina: false });
    });
  }

  if (els.cargarMas) {
    els.cargarMas.addEventListener('click', () => {
      paginaActual += 1;
      aplicar({ reiniciarPagina: false });
    });
  }

  if (els.limpiar) {
    els.limpiar.addEventListener('click', () => {
      if (els.tipo) els.tipo.value = '';
      if (els.ciudad) els.ciudad.value = '';
      if (els.horario) els.horario.value = '';
      if (els.busqueda) els.busqueda.value = '';
      if (els.ordenar) els.ordenar.value = 'relevancia';

      ordenar();
      aplicar();

      const textoOriginal = 'Limpiar filtros';
      els.limpiar.textContent = 'Filtros limpiados';
      setTimeout(() => { els.limpiar.textContent = textoOriginal; }, 1500);
    });
  }

  // --------------------------------------------------------------------------
  // Modal de detalle
  // --------------------------------------------------------------------------

  const modal = {
    raiz:       document.getElementById('modal-oferta'),
    avatar:     document.getElementById('modal-avatar'),
    foto:       document.getElementById('modal-imagen-foto'),
    ciudad:     document.getElementById('modal-ciudad'),
    titulo:     document.getElementById('modal-titulo'),
    compania:   document.getElementById('modal-compania'),
    salario:    document.getElementById('modal-salario'),
    periodo:    document.getElementById('modal-periodo'),
    tipo:       document.getElementById('modal-tipo'),
    horario:    document.getElementById('modal-horario'),
    desc:       document.getElementById('modal-descripcion'),
    tareas:     document.getElementById('modal-tareas'),
    requisitos: document.getElementById('modal-requisitos'),
    publicada:   document.getElementById('modal-publicada'),
    cerrar:     document.getElementById('modal-cerrar'),
    postular:   document.getElementById('modal-postular'),
    verSueldo:  document.getElementById('modal-ver-sueldo'),
    verCarta:   document.getElementById('modal-ver-carta'),
  };

  const aviso = document.getElementById('aviso');
  let ofertaAbierta = null;
  let elementoPrevio = null;

  const pintarLista = (contenedor, items) => {
    if (!contenedor) return;
    contenedor.innerHTML = '';
    items.forEach((texto) => {
      const li = document.createElement('li');
      li.textContent = texto;
      contenedor.appendChild(li);
    });
  };

  function mostrarAviso(mensaje) {
    if (!aviso) return;
    aviso.textContent = mensaje;
    aviso.hidden = false;
    aviso.classList.add('visible');
    clearTimeout(aviso._temporizador);
    aviso._temporizador = setTimeout(() => {
      aviso.classList.remove('visible');
      setTimeout(() => { aviso.hidden = true; }, 250);
    }, 3200);
  }

  function abrirDetalle(oferta) {
    if (!modal.raiz) return;

    ofertaAbierta = oferta;
    elementoPrevio = document.activeElement;

    const detalle = OFERTAS[Number(oferta.dataset.indice)] || { tareas: [], requisitos: [] };

    const leer = (sel) => {
      const nodo = oferta.querySelector(sel);
      return nodo ? nodo.textContent.trim() : '';
    };

    const avatarOrigen = oferta.querySelector('.avatar');
    if (avatarOrigen && modal.avatar) {
      modal.avatar.textContent = avatarOrigen.textContent.trim();
      modal.avatar.setAttribute('style', avatarOrigen.getAttribute('style') || '');
    }

    // La imagen ya fue generada por empleo.js. Va con alt vacío: es decorativa
    // aquí, el título del diálogo ya identifica la oferta.
    const fotoOrigen = oferta.querySelector('.empleo-imagen img');
    if (fotoOrigen && modal.foto) {
      modal.foto.src = fotoOrigen.getAttribute('src') || '';
      modal.foto.alt = '';
    }

    if (modal.ciudad) modal.ciudad.textContent = leer('.ubicacion');
    if (modal.titulo) modal.titulo.textContent = leer('.titulo-empleo');
    if (modal.compania) modal.compania.textContent = leer('.empresa strong');
    if (modal.salario) modal.salario.textContent = leer('.salario strong');
    if (modal.periodo) modal.periodo.textContent = leer('.salario span');
    if (modal.tipo) modal.tipo.textContent = oferta.dataset.tipo || '';
    if (modal.horario) modal.horario.textContent = oferta.dataset.horario || '';
    if (modal.desc) modal.desc.textContent = leer('.descripcion');
    if (modal.publicada) modal.publicada.textContent = leer('.fecha');

    pintarLista(modal.tareas, detalle.tareas || []);
    pintarLista(modal.requisitos, detalle.requisitos || []);

    modal.raiz.hidden = false;
    document.body.classList.add('no-scroll');
    requestAnimationFrame(() => modal.raiz.classList.add('visible'));

    if (modal.cerrar) modal.cerrar.focus();
  }

  function cerrarDetalle() {
    if (!modal.raiz || modal.raiz.hidden) return;

    modal.raiz.classList.remove('visible');
    document.body.classList.remove('no-scroll');
    ofertaAbierta = null;

    setTimeout(() => { modal.raiz.hidden = true; }, 220);

    if (elementoPrevio && typeof elementoPrevio.focus === 'function') {
      elementoPrevio.focus();
    }
    elementoPrevio = null;
  }

  if (modal.raiz) {
    modal.raiz.querySelectorAll('[data-cerrar-modal]').forEach((nodo) => {
      nodo.addEventListener('click', cerrarDetalle);
    });

    if (modal.cerrar) modal.cerrar.addEventListener('click', cerrarDetalle);

    if (modal.postular) {
      modal.postular.addEventListener('click', () => {
        const titulo = ofertaAbierta
          ? ofertaAbierta.querySelector('.titulo-empleo').textContent.trim()
          : 'la oferta';
        mostrarAviso('Tu postulación a "' + titulo + '" quedó registrada. Revisa tu perfil.');
        cerrarDetalle();
      });
    }

    // Abrir el simulador de sueldo con los datos de esta oferta
    if (modal.verSueldo) {
      modal.verSueldo.addEventListener('click', () => {
        const oferta = ofertaAbierta;
        if (!oferta) return;

        const textoSalario = oferta.querySelector('.salario');
        const monto = textoSalario ? textoSalario.querySelector('strong').textContent : '';
        const periodoTexto = textoSalario ? textoSalario.querySelector('span').textContent : '';
        const porHora = /hora/i.test(periodoTexto);

        const numero = parseInt(String(monto).replace(/\D/g, ''), 10) || 0;
        const puesto = oferta.querySelector('.titulo-empleo').textContent.trim();
        const empresa = oferta.querySelector('.empresa strong').textContent.trim();

        document.dispatchEvent(new CustomEvent('estutrabajo:sueldo', {
          detail: {
            bruto: numero,
            periodo: porHora ? 'hora' : 'mes',
            contexto: puesto + ' en ' + empresa + ' — ' + monto.trim() + ' ' + periodoTexto.toLowerCase(),
          },
        }));
      });
    }

    // Abrir la carta para esta oferta
    if (modal.verCarta) {
      modal.verCarta.addEventListener('click', () => {
        const oferta = ofertaAbierta;
        if (!oferta) return;
        document.dispatchEvent(new CustomEvent('estutrabajo:carta', {
          detail: { indice: Number(oferta.dataset.indice) },
        }));
      });
    }

    document.addEventListener('keydown', (evento) => {
      if (evento.key === 'Escape' && !modal.raiz.hidden) cerrarDetalle();
    });

    // Foco atrapado dentro del panel
    modal.raiz.addEventListener('keydown', (evento) => {
      if (evento.key !== 'Tab') return;

      const focusables = modal.raiz.querySelectorAll(
        'a[href], button:not([disabled]), select, input'
      );
      if (!focusables.length) return;

      const primero = focusables[0];
      const ultimo = focusables[focusables.length - 1];

      if (evento.shiftKey && document.activeElement === primero) {
        evento.preventDefault();
        ultimo.focus();
      } else if (!evento.shiftKey && document.activeElement === ultimo) {
        evento.preventDefault();
        primero.focus();
      }
    });
  }

  todasLasOfertas.forEach((oferta) => {
    oferta.querySelectorAll('.titulo-empleo a, .inscribirme').forEach((nodo) => {
      nodo.addEventListener('click', (evento) => {
        evento.preventDefault();
        abrirDetalle(oferta);
      });
    });
  });

  // --------------------------------------------------------------------------
  // Parámetros de URL (?busqueda= &ciudad= &tipo=)
  // --------------------------------------------------------------------------

  const params = new URLSearchParams(window.location.search);
  const desdeUrl = {
    busqueda: params.get('busqueda'),
    ciudad: params.get('ciudad'),
    tipo: params.get('tipo'),
  };

  if (desdeUrl.busqueda && els.busqueda) els.busqueda.value = desdeUrl.busqueda;
  if (desdeUrl.ciudad && els.ciudad) els.ciudad.value = desdeUrl.ciudad;
  if (desdeUrl.tipo && els.tipo) els.tipo.value = desdeUrl.tipo;

  // --------------------------------------------------------------------------
  // Arranque
  // --------------------------------------------------------------------------

  ordenar();
  aplicar({ reiniciarPagina: !!(desdeUrl.busqueda || desdeUrl.ciudad || desdeUrl.tipo) });

  // El resto de módulos tienen su propio punto de entrada
  document.dispatchEvent(new CustomEvent('estutrabajo:listo', { detail: { lista, ofertas: todasLasOfertas } }));
});