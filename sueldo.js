// ============================================================================
//  sueldo.js — Simulador de sueldo neto (estimación, no asesoría legal)
//
//  ⚠ IMPORTANTE: estas cifras son APROXIMADAS y con fines educativos.
//    Las deducciones reales dependen del salario, la antigüedad, la ciudad,
//    las cargas familiares y muchas más cosas. Para un cálculo real,
//    consulta con tu empleador o con la DIAN.
//
//  Cómo funciona: de un sueldo bruto mensual se descuentan los aportes
//  obligatorio (salud, pensión, ARL) y la retención en la fuente, que en
//  Colombia es progresiva por tramos.
// ============================================================================

document.addEventListener('DOMContentLoaded', () => {
  const boton = document.getElementById('abrir-sueldo');
  const modal = document.getElementById('modal-sueldo');
  if (!boton || !modal) return;

  const campoBruto = document.getElementById('sueldo-bruto');
  const campoPeriodo = document.getElementById('sueldo-periodo');
  const resultado = document.getElementById('sueldo-resultado');
  const botonCerrar = document.getElementById('sueldo-cerrar');
  const contextoOferta = document.getElementById('sueldo-contexto');

  const formatter = new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  });

  // --------------------------------------------------------------------------
  // Parámetros
  // --------------------------------------------------------------------------

  // Salario mínimo de referencia. Colombia lo actualiza cada año: revisa el
  // valor vigente antes de usar esto en serio (Diario Oficial, enero).
  const SALARIO_MINIMO = 1413500;

  // Para pasar de una tarifa por hora a mensual se asume este número de
  // horas al mes. Es una suposición, no un dato oficial.
  const HORAS_MES = 120;

  const APORTES = {
    salud:     { etiqueta: 'Salud (4%)',        porcentaje: 0.04 },
    pension:   { etiqueta: 'Pensión (4%)',      porcentaje: 0.04 },
    arl:       { etiqueta: 'ARL (0,522%)',      porcentaje: 0.00522 },
    cajas:     { etiqueta: 'Caja de compensación (3%)', porcentaje: 0.03 },
  };

  // Retención en la fuente: tramos aproximados. Se aplica solo a la parte
  // del salario que supera cada umbral, no al total.
  const TRAMOS_RETENCION = [
    { hasta: 950000,   tasa: 0.00 },
    { hasta: 1500000,  tasa: 0.10 },
    { hasta: 2100000,  tasa: 0.15 },
    { hasta: 2600000,  tasa: 0.19 },
    { hasta: 3200000,  tasa: 0.24 },
    { hasta: 3800000,  tasa: 0.28 },
    { hasta: Infinity, tasa: 0.33 },
  ];

  function retencionEnLaFuente(bruto) {
    let restante = bruto;
    let anterior = 0;
    let total = 0;

    for (const tramo of TRAMOS_RETENCION) {
      if (restante <= 0) break;
      const ancho = tramo.hasta - anterior;
      const base = Math.min(restante, ancho);
      total += base * tramo.tasa;
      restante -= base;
      anterior = tramo.hasta;
    }

    return total;
  }

  function calcular(bruto) {
    if (!bruto || bruto <= 0) return null;

    const aportes = {};
    let totalAportes = 0;
    Object.keys(APORTES).forEach((clave) => {
      const valor = bruto * APORTES[clave].porcentaje;
      aportes[clave] = valor;
      totalAportes += valor;
    });

    const retencion = retencionEnLaFuente(bruto);
    const neto = bruto - totalAportes - retencion;

    return {
      bruto,
      aportes,
      totalAportes,
      retencion,
      neto,
      minimos: bruto / SALARIO_MINIMO,
    };
  }

  // --------------------------------------------------------------------------
  // Pintado
  // --------------------------------------------------------------------------

  function pintar() {
    const bruto = parseInt(campoBruto.value, 10);
    const periodo = campoPeriodo.value;

    const brutoMensual = periodo === 'hora' ? bruto * HORAS_MES : bruto;
    const calculo = calcular(brutoMensual);

    if (!calculo) {
      resultado.innerHTML = '<p class="sueldo-vacio">Escribe un sueldo para ver el cálculo.</p>';
      return;
    }

    const etiquetaSueldo = periodo === 'hora'
      ? formatter.format(bruto) + ' por hora'
      : formatter.format(bruto) + ' al mes';

    const filasAportes = Object.keys(APORTES).map((clave) => {
      const a = APORTES[clave];
      const valor = periodo === 'hora' ? calculo.aportes[clave] / HORAS_MES : calculo.aportes[clave];
      return '<div class="sueldo-fila">' +
        '<span>' + a.etiqueta + '</span>' +
        '<strong>' + formatter.format(valor) + '</strong>' +
        '</div>';
    }).join('');

    const retencionVisible = periodo === 'hora' ? calculo.retencion / HORAS_MES : calculo.retencion;
    const netoVisible = periodo === 'hora' ? calculo.neto / 120 : calculo.neto;

    resultado.innerHTML =
      '<p class="sueldo-entrada">' + etiquetaSueldo + '</p>' +
      '<div class="sueldo-fila">' +
        '<span>Total de aportes a salud, pensión y ARL</span>' +
        '<strong>− ' + formatter.format(periodo === 'hora' ? calculo.totalAportes / HORAS_MES : calculo.totalAportes) + '</strong>' +
      '</div>' +
      filasAportes +
      '<div class="sueldo-fila">' +
        '<span>Retención en la fuente (aprox.)</span>' +
        '<strong>− ' + formatter.format(retencionVisible) + '</strong>' +
      '</div>' +
      '<div class="sueldo-neto">' +
        '<span>Te llevas aproximadamente</span>' +
        '<strong>' + formatter.format(netoVisible) + '</strong>' +
      '</div>' +
      (periodo === 'hora'
        ? '<p class="sueldo-nota">Calculado sobre ' + HORAS_MES + ' horas al mes.</p>'
        : '<p class="sueldo-nota">Equivale a ' + calculo.minimos.toFixed(1) +
          ' salarios mínimos.</p>');
  }

  // --------------------------------------------------------------------------
  // Abrir / cerrar
  // --------------------------------------------------------------------------

  let previo = null;

  function abrir(brutoSugerido, periodoSugerido, contexto) {
    previo = document.activeElement;

    if (brutoSugerido) campoBruto.value = brutoSugerido;
    if (periodoSugerido) campoPeriodo.value = periodoSugerido;

    if (contextoOferta) {
      contextoOferta.textContent = contexto || '';
      contextoOferta.hidden = !contexto;
    }

    pintar();

    modal.hidden = false;
    document.body.classList.add('no-scroll');
    requestAnimationFrame(() => modal.classList.add('visible'));
    campoBruto.focus();
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
  if (botonCerrar) botonCerrar.addEventListener('click', cerrar);

  modal.querySelectorAll('[data-cerrar-sueldo]').forEach((n) => {
    n.addEventListener('click', cerrar);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modal.hidden) cerrar();
  });

  campoBruto.addEventListener('input', pintar);
  campoPeriodo.addEventListener('change', pintar);

  // Botón "usar el sueldo de esta oferta": lo llama el modal de detalle.
  document.addEventListener('estutrabajo:sueldo', (evento) => {
    const { bruto, periodo, contexto } = evento.detail || {};
    abrir(bruto, periodo, contexto);
  });

  pintar();
});