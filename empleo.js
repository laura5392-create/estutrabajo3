// ============================================================================
//  empleo.js — Inserta la ilustración y reubica el badge en cada oferta
//  Se ejecuta en el inicio y en "buscar-empleos".
//
//  Qué imagen usa cada oferta:
//    1. OFERTAS[indice].imagen  → si la oferta trae imagen propia (ganaderas,
//       agrícolas, rurales: no encajan en ningún tipo genérico)
//    2. TIPO_VISUAL[data-tipo] → si no, la del tipo de trabajo
//    3. TIPO_VISUAL['Ventas']   → último recurso
// ============================================================================

document.addEventListener('DOMContentLoaded', () => {
  const porDefecto = TIPO_VISUAL['Ventas'];

  document.querySelectorAll('.empleo').forEach((oferta) => {
    const indice = Number(oferta.dataset.indice);
    const datos = OFERTAS[indice];
    const tipo = oferta.dataset.tipo || '';

    // 1. Imagen propia de la oferta; 2. la del tipo; 3. la de Ventas
    const visual =
      (datos && datos.imagen) ||
      TIPO_VISUAL[tipo] ||
      porDefecto;

    const contenedor = document.createElement('div');
    contenedor.className = 'empleo-imagen';

    const img = document.createElement('img');
    img.src = visual.src;
    img.alt = visual.alt;
    img.loading = 'lazy';
    img.decoding = 'async';
    img.width = 800;
    img.height = 500;

    contenedor.appendChild(img);

    // El badge pasa de .fecha a la imagen, para quedar superpuesto.
    // Su color lo mantiene la clase original: .badge-nuevo o .badge-destacado.
    const badge = oferta.querySelector('.fecha .badge-nuevo, .fecha .badge-destacado');
    if (badge) contenedor.appendChild(badge);

    // El puntaje de encaje, si encaje.js ya lo dejó marcado en la tarjeta.
    const puntaje = oferta.querySelector('.puntaje-encaje');
    if (puntaje) contenedor.appendChild(puntaje);

    oferta.insertBefore(contenedor, oferta.firstChild);
  });
});