// ============================================================================
//  main.js — Comportamiento común a las 3 páginas
//  · Skip link
//  · Menú móvil (el botón se inyecta por JS)
//  · Sombra del header al hacer scroll
//  · Botón "volver arriba"
//  · Barra de progreso de lectura
//  · Animaciones de entrada
//  · Enlaces externos seguros
//  · Cifras de ofertas sincronizadas con la realidad
// ============================================================================

document.addEventListener('DOMContentLoaded', () => {
  const reducirMovimiento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // --------------------------------------------------------------------------
  // 1. Skip link — foco real en el destino, no solo scroll
  // --------------------------------------------------------------------------

  const skipLink = document.querySelector('.skip-link');

  if (skipLink) {
    skipLink.addEventListener('click', (evento) => {
      const destino = document.querySelector(skipLink.getAttribute('href'));
      if (!destino) return;

      evento.preventDefault();
      destino.setAttribute('tabindex', '-1');
      destino.focus({ preventScroll: true });
      destino.scrollIntoView({ behavior: reducirMovimiento ? 'auto' : 'smooth' });
      destino.addEventListener('blur', () => destino.removeAttribute('tabindex'), { once: true });
    });
  }

  // --------------------------------------------------------------------------
  // 2. Menú móvil
  // --------------------------------------------------------------------------

  const barraSuperior = document.querySelector('.barra-superior');
  const menu = document.querySelector('.menu');

  if (barraSuperior && menu) {
    if (!menu.id) menu.id = 'menu-principal';

    const botonMenu = document.createElement('button');
    botonMenu.className = 'menu-toggle';
    botonMenu.setAttribute('aria-label', 'Abrir menú de navegación');
    botonMenu.setAttribute('aria-controls', menu.id);
    botonMenu.setAttribute('aria-expanded', 'false');
    botonMenu.innerHTML =
      '<span class="menu-toggle-bar"></span>' +
      '<span class="menu-toggle-bar"></span>' +
      '<span class="menu-toggle-bar"></span>';

    const cta = barraSuperior.querySelector(':scope > .boton');
    barraSuperior.insertBefore(botonMenu, cta || null);

    const cerrarMenu = () => {
      menu.classList.remove('menu-abierto');
      botonMenu.setAttribute('aria-expanded', 'false');
      botonMenu.setAttribute('aria-label', 'Abrir menú de navegación');
      document.body.classList.remove('no-scroll');
    };

    const abrirMenu = () => {
      menu.classList.add('menu-abierto');
      botonMenu.setAttribute('aria-expanded', 'true');
      botonMenu.setAttribute('aria-label', 'Cerrar menú de navegación');
      document.body.classList.add('no-scroll');
    };

    botonMenu.addEventListener('click', () => {
      const abierto = botonMenu.getAttribute('aria-expanded') === 'true';
      if (abierto) cerrarMenu();
      else abrirMenu();
    });

    // Cerrar al navegar
    menu.querySelectorAll('a').forEach((enlace) => {
      enlace.addEventListener('click', cerrarMenu);
    });

    // Cerrar con Escape
    document.addEventListener('keydown', (evento) => {
      if (evento.key === 'Escape' && menu.classList.contains('menu-abierto')) {
        cerrarMenu();
        botonMenu.focus();
      }
    });

    // Cerrar al volver a escritorio
    window.addEventListener('resize', () => {
      if (window.innerWidth > 760 && menu.classList.contains('menu-abierto')) {
        cerrarMenu();
      }
    });
  }

  // --------------------------------------------------------------------------
  // 3. Barra de progreso + sombra del header (mismo listener)
  // --------------------------------------------------------------------------

  const encabezado = document.querySelector('.encabezado');

  const barraProgreso = document.createElement('div');
  barraProgreso.className = 'scroll-progress';
  barraProgreso.setAttribute('aria-hidden', 'true');
  document.body.appendChild(barraProgreso);

  const alDesplazar = () => {
    const desplazamiento = window.scrollY;

    if (encabezado) {
      encabezado.classList.toggle('encabezado-scroll', desplazamiento > 10);
    }

    const altoUtil = document.documentElement.scrollHeight - window.innerHeight;
    const porcentaje = altoUtil > 0 ? (desplazamiento / altoUtil) * 100 : 0;
    barraProgreso.style.width = porcentaje.toFixed(2) + '%';
  };

  window.addEventListener('scroll', alDesplazar, { passive: true });
  window.addEventListener('resize', alDesplazar, { passive: true });
  alDesplazar();

  // --------------------------------------------------------------------------
  // 4. Botón "volver arriba"
  // --------------------------------------------------------------------------

  const botonSubir = document.createElement('button');
  botonSubir.className = 'back-to-top';
  botonSubir.setAttribute('aria-label', 'Volver al inicio de la página');
  botonSubir.innerHTML = '<i class="fa-solid fa-arrow-up" aria-hidden="true"></i>';
  document.body.appendChild(botonSubir);

  const alternarBotonSubir = () => {
    botonSubir.classList.toggle('visible', window.scrollY > 300);
  };

  botonSubir.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: reducirMovimiento ? 'auto' : 'smooth' });
    botonSubir.blur();
  });

  window.addEventListener('scroll', alternarBotonSubir, { passive: true });
  alternarBotonSubir();

  // --------------------------------------------------------------------------
  // 5. Animaciones de entrada
  // --------------------------------------------------------------------------

  if (!reducirMovimiento && 'IntersectionObserver' in window) {
    const animables = document.querySelectorAll(
      '.hero-texto, .hero-visual, .seccion-encabezado, .tarjeta, .stat, ' +
      '.frecuente, .formulario, .vista-previa, .panel-filtros, .cta-band, .empleo'
    );

    const observador = new IntersectionObserver(
      (entradas) => {
        entradas.forEach((entrada) => {
          if (!entrada.isIntersecting) return;
          entrada.target.classList.add('fade-in-up');
          observador.unobserve(entrada.target);
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
    );

    animables.forEach((elemento) => {
      elemento.classList.add('will-fade');
      observador.observe(elemento);
    });
  }

  // --------------------------------------------------------------------------
  // 6. Enlaces externos — abrir en pestaña nueva de forma segura
  // --------------------------------------------------------------------------

  document.querySelectorAll('a[href^="http"]').forEach((enlace) => {
    if (enlace.hostname === window.location.hostname) return;
    if (enlace.hasAttribute('target')) return;
    enlace.setAttribute('target', '_blank');
    enlace.setAttribute('rel', 'noopener noreferrer');
  });

  // --------------------------------------------------------------------------
  // 7. Cifras de ofertas sincronizadas con el HTML real
  // --------------------------------------------------------------------------
  // Evita que "16+ ofertas" se desincronice al añadir nuevas tarjetas.

  // En "buscar-empleos" el total se deduce de las tarjetas reales.
  // En el inicio se usa data-total-ofertas, porque solo muestra 3 destacadas.
  const declaradas = parseInt(document.body.dataset.totalOfertas, 10);
  const totalOfertas = declaradas > 0 ? declaradas : document.querySelectorAll('.empleo').length;

  if (totalOfertas > 0) {
    document.querySelectorAll('[data-contador-ofertas]').forEach((nodo) => {
      nodo.textContent = totalOfertas + '+';
    });

    document.querySelectorAll('[data-texto-ofertas]').forEach((nodo) => {
      nodo.textContent = totalOfertas + '+ ofertas flexibles';
    });
  }
});
