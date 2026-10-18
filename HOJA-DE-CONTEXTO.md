# Hoja de Contexto — EstuTrabajo

> Estado del proyecto y guía para retomarlo.
> Última actualización: 1 de octubre de 2026

---

## 1. El proyecto

**EstuTrabajo** es un portal de empleo ficticio para **estudiantes de 16–25 años en Colombia** que necesitan trabajar sin abandonar sus estudios.

Los empleos tradicionales de tiempo completo no les sirven porque sus horarios son irreducibles. El sitio ofrece ofertas de **medio tiempo y horario flexible**, filtrables por tipo, ciudad y disponibilidad.

**Stack:** HTML5 · CSS3 (Custom Properties) · JavaScript Vanilla · Font Awesome 6 · Google Fonts. Sin frameworks, sin build, sin dependencias, sin backend. Los datos viven en `localStorage`.

---

## 2. Estructura

```text
Mi primera pagina web/
├── index.html                    # Inicio
├── buscar-empleos.html            # 21 ofertas · filtros · orden · carga progresiva · modal + 3 herramientas
├── mi-perfil.html                 # Formulario + vista previa en vivo
├── DESIGN.md                      # Sistema de diseño (fuente de verdad visual)
├── README.md                      # Guía de uso
├── HOJA-DE-CONTEXTO.md            # Este documento
├── Ficha_Definicion_Proyecto.docx # Enunciado original (binario)
│
├── css/estilos.css                # ~2.600 líneas · único archivo de estilos
│
├── js/
│   ├── main.js      # Skip link, menú móvil, botón subir, progreso, reveal, contadores
│   ├── ofertas.js   # ⚠ DATOS: tareas, requisitos, disponibilidad, habilidades e imagen de los 21 puestos
│   ├── empleo.js    # Genera la ilustración y el badge de cada oferta
│   ├── empleos.js   # Filtros, orden, carga progresiva, modal de detalle, parámetros URL
│   ├── encaje.js    # Calculadora de encaje horario + afinidad con el perfil
│   ├── sueldo.js    # Simulador de sueldo neto (estimación colombiana)
│   ├── carta.js     # Generador de carta de presentación
│   ├── perfil.js    # Vista previa en vivo + localStorage + limpiar
│   ├── stats.js     # Contadores animados, partículas, inclinación 3D
│   └── theme.js     # Alternador claro/oscuro
│
├── img/
│   ├── adolecentebuscandotrabajo.png   # Foto del héroe
│   └── ofertas/                         # Ilustraciones SVG (8 en total)
│       ├── ventas.svg            · 3,7 KB
│       ├── atencion.svg          · 3,2 KB
│       ├── administracion.svg    · 3,6 KB
│       ├── servicios.svg         · 3,5 KB
│       ├── educacion.svg         · 3,1 KB
│       ├── tecnologia.svg        · 3,5 KB
│       ├── agricultura.svg        · 3,2 KB   # Solo para la oferta 18 (finca cafetera)
│       └── turismo.svg           · 4,1 KB   # Solo para la oferta 21 (guía de la ruta)
│
└── (legacy, ya no interviene en el sitio)
    ├── muestrario.html            # 4 conceptos de estilo del tema Pop
    └── muestrario-colores.html    # 4 paletas del tema Pop
```

Orden de carga: `main.js` → **`ofertas.js`** → `empleo.js` → `empleos.js` → `encaje.js` → `sueldo.js` → `carta.js` → `stats.js` → `theme.js`.

`ofertas.js` va segundo porque es **solo datos**: el resto lo consume. Si se carga después, `OFERTAS` sería `undefined` y se rompe todo.

`empleo.js` va antes que `empleos.js` porque este último lee la imagen ya generada para ponerla en el modal.

En el inicio solo cargan `main.js` → `empleo.js` → `stats.js` → `theme.js`, porque `ofertas.js` también se necesita ahí para las ilustraciones.

---

## 3. Sistema de diseño

**Tema actual: Profesional** (referencia LinkedIn Jobs / Indeed). Definido por completo en [`DESIGN.md`](DESIGN.md).

- Fondo `#F5F7FA`, superficies blancas, marca azul `#0F7BFF`
- Bordes de 1px, sombras difusas, radios 8/12/16/999px
- Baloo 2 para títulos, Inter para cuerpo
- Tema oscuro con `[data-theme="dark"]` (solo redefine tokens)

> **El tema Pop (lima `#C6F24E`, frambuesa, bordes negros de 2px) está reemplazado.**
> `muestrario.html` y `muestrario-colores.html` son históricos. No tomes decisiones de diseño a partir de ellos.

---

## 4. Contrato de los datos

**Este es el punto más frágil del proyecto.** Los filtros se basan en atributos `data-*` que deben coincidir **exactamente** con los valores de los `<option>`.

| Atributo | Valores válidos |
|----------|-----------------|
| `data-tipo` | Ventas · Atención al cliente · Administración · Servicios · Educación · Tecnología |
| `data-ciudad` | Bogotá · Medellín · Manizales · **Pensilvania** · Cali · Pereira · Ibagué |
| `data-horario` | Medio tiempo · Tiempo completo · Horario flexible · Fines de semana |

Si añades una oferta con un valor que no existe en el select, **el filtro no la encontrará**.

> **Ojo con Pensilvania.** El `value` del `<option>` es `Pensilvania` (para que el filtro funcione), pero el texto visible del selector y de la tarjeta es `Pensilvania, Caldas`. Así el municipio se distingue sin romper la comparación.
>
> Para añadir un municipio hay que tocar **los dos selects de ciudad**: `#donde-buscar` (el buscador del header, está en las 3 páginas) y `#filtro-ciudad` (solo en `buscar-empleos.html`).

### Las 21 ofertas

| # | Puesto | Tipo | Ciudad | Horario | Badges |
|---|--------|------|--------|---------|--------|
| 1 | Auxiliar de tienda | Ventas | Bogotá | Medio tiempo | Nuevo |
| 2 | Atención al cliente | Atención al cliente | Manizales | Horario flexible | — |
| 3 | Asistente administrativo | Administración | Manizales | Medio tiempo | — |
| 4 | Ayudante de cafetería | Servicios | Cali | Fines de semana | — |
| 5 | Monitor de biblioteca | Servicios | Bogotá | Horario flexible | — |
| 6 | Cajero de supermercado | Ventas | Medellín | Fines de semana | — |
| 7 | Tutor de matemáticas | Educación | Medellín | Horario flexible | — |
| 8 | Community manager | Tecnología | Pereira | Tiempo completo | Destacado |
| 9 | Recepcionista | Administración | Ibagué | Medio tiempo | — |
| 10 | Vendedor de mostrador | Ventas | Cali | Medio tiempo | Nuevo |
| 11 | Tutor de inglés | Educación | Bogotá | Horario flexible | Nuevo |
| 12 | Mesero | Servicios | Medellín | Fines de semana | Nuevo |
| 13 | Diseñador UI Jr. | Tecnología | Bogotá | Tiempo completo | Destacado |
| 14 | Soporte técnico | Atención al cliente | Manizales | Medio tiempo | — |
| 15 | Data entry | Administración | Pereira | Horario flexible | — |
| 16 | Teleoperador | Ventas | Ibagué | Tiempo completo | — |
| 17 | Auxiliar de almacén | Ventas | **Pensilvania** | Horario flexible | Nuevo |
| 18 | Supervisor de finca cafetera | Servicios | **Pensilvania** | Medio tiempo | Nuevo |
| 19 | Auxiliar de fruvería | Ventas | **Pensilvania** | Fines de semana | Nuevo |
| 20 | Auxiliar administrativo | Administración | **Pensilvania** | Horario flexible | — |
| 21 | Guía de ruta del café | Servicios | **Pensilvania** | Fines de semana | — |

Las ofertas 17–21 son de Pensilvania, Caldas. El contexto local manda: economía cafetera y
agricultural del valle del Magdalena. Los detalles son deliberadamente específicos
(cuaderno de fiado, café maduro contra verde, pago por kilo, "bacante" por el municipio),
para que no parezcan un calco de las ofertas de las grandes ciudades.

### Parámetros de URL

`empleos.js` lee `window.location.search` y prellena los filtros.

| Parámetro | Campo | Ejemplo |
|-----------|-------|---------|
| `busqueda` | `#filtro-busqueda` | `?busqueda=tutor` |
| `ciudad` | `#filtro-ciudad` | `?ciudad=Medellín` |
| `tipo` | `#filtro-tipo` | `?tipo=Educación` |

Combinables: `?busqueda=tutor&ciudad=Medellín&tipo=Educación`

La búsqueda ignora acentos: "tutoria" encuentra "tutoría".

## 5. Las ilustraciones de las ofertas

Cada oferta muestra una ilustración. Hay **8 SVG** dibujados a medida, no fotos: no hay acceso a internet para descargar imágenes y las fotos de stock traen problemas de licencia. Un SVG pesa ~3,5 KB y se ve nítido a cualquier resolución.

### Cómo se decide la imagen

Es una cadena de tres pasos, en este orden:

1. `OFERTAS[indice].imagen` — si la oferta trae imagen propia
2. `TIPO_VISUAL[data-tipo]` — si no, la imagen del tipo de trabajo
3. `TIPO_VISUAL['Ventas']` — último recurso

`empleo.js` implementa exactamente esto. Los dos primeros casos usan la misma forma: `{ src, alt }`.

### Imagen por tipo (6)

| Tipo de oferta | Archivo | Qué muestra |
|----------------|---------|-------------|
| Ventas | `ventas.svg` | Mostrador, toldo, estantería y bolsa de compras |
| Atención al cliente | `atencion.svg` | Agente con auriculares, pantalla de chat y reloj |
| Administración | `administracion.svg` | Escritorio con documentos, carpeta y portátil |
| Servicios | `servicios.svg` | Barra de cafetería con café y un libro abierto |
| Educación | `educacion.svg` | Pizarra con letras, lápiz y cuaderno |
| Tecnología | `tecnologia.svg` | Pantalla con código, nodos y smartphone |

`servicios.svg` cubre tres oficios a propósito: cafetería, biblioteca y mesería.

### Imagen por oferta (2)

Estas dos **anulan** la del tipo, porque su contenido no encaja en ningún tipo genérico:

| Oferta | Archivo | Qué muestra |
|--------|---------|-------------|
| 18 · Supervisor de finca cafetera | `agricultura.svg` | Cafetal en ladera, montañas de la Cordillera Central, cereza de café, canasta de recolección |
| 21 · Guía de ruta del café | `turismo.svg` | Sendero junto al río, grupo de visitantes, cartel "Ruta del café", aves |

> Sin el campo `imagen` por oferta, estas dos habrían salido con el dibujo de una
> **cafetería**, que es lo que devuelve `TIPO_VISUAL['Servicios']`. Ese fue el motivo
> de crear el mecanismo, no un capricho.

### Other cosas que hace `empleo.js`

- Inserta la imagen como **primer hijo** de la tarjeta.
- **Mueve el badge** de `.fecha` a la imagen, para que quede superpuesto arriba a la derecha.
- Recoge el `.puntaje-encaje` si `encaje.js` ya lo dejó marcado, y lo sube también a la imagen.

**Las imágenes no están en el HTML.** `empleo.js` las inyecta al arrancar. Beneficio: añadir ofertas nuevas no requiere tocar el HTML.

### Cómo añadir una ilustración nueva

**Si es para un tipo de trabajo nuevo:**
1. Crear el SVG en `img/ofertas/`, con `<title>` como primer hijo de `<svg>` y `viewBox="0 0 800 500"`
2. Añadir la entrada en `TIPO_VISUAL` de `js/ofertas.js`, con la forma `{ src, alt }`
3. Si el tipo no existe en los `<select>` de filtros, añadirlo ahí y a la tabla de la sección 4

**Si es para una sola oferta concreta:**
1. Crear el SVG como arriba
2. Añadir `imagen: { src: …, alt: … }` dentro del bloque de esa oferta en `OFERTAS`

El `alt` describe **la ilustración**, no la oferta. Para lectores de pantalla la oferta ya la describe el texto de la tarjeta.

> ⚠ Mantén la misma forma `{ src, alt }` en los dos sitios. Se empezó usando `img:` en
> `TIPO_VISUAL` y `src:` en `imagen`, y el desajuste hacía que la imagen propia se
> ignorara **en silencio**. Unifícalo todo a `src`.

### Ids que el JS necesita

**Buscar empleos (51 ids en total)**
- Listado y filtros: `#lista-empleos` · `#filtro-tipo` · `#filtro-ciudad` · `#filtro-horario` · `#filtro-busqueda` · `#ordenar` · `#resultados` · `#resultados-cantidad` · `#sin-resultados` · `#limpiar-filtros` · `#cargar-mas` · `#aviso`
- Encaje horario: `#panel-encaje` · `#encaje-desplegable` · `#encaje-titulo` · `#encaje-subtitulo` · `#encaje-cuento` · `#encaje-vacio` · `#encaje-limpiar`
- Modal de oferta: `#modal-oferta` · `#modal-avatar` · `#modal-imagen-foto` · `#modal-ciudad` · `#modal-titulo` · `#modal-compania` · `#modal-salario` · `#modal-periodo` · `#modal-tipo` · `#modal-horario` · `#modal-descripcion` · `#modal-tareas` · `#modal-requisitos` · `#modal-publicada` · `#modal-cerrar` · `#modal-postular` · `#modal-ver-sueldo` · `#modal-ver-carta`
- Simulador de sueldo: `#modal-sueldo` · `#sueldo-titulo` · `#sueldo-bruto` · `#sueldo-periodo` · `#sueldo-resultado` · `#sueldo-contexto` · `#sueldo-cerrar` · `#abrir-sueldo`
- Generador de carta: `#modal-carta` · `#carta-titulo` · `#carta-oferta` · `#carta-texto` · `#carta-contexto` · `#carta-aviso` · `#carta-copiar` · `#carta-limpiar` · `#abrir-carta`

La retícula de disponibilidad son **21 botones `.encaje-franja`** con `data-dia` y `data-franja`. Se generan desde `FRANJAS` y `DIAS` en `ofertas.js`; el HTML solo pone los encabezados.

**Mi perfil (2)**
`#formulario-perfil` · `#limpiar-perfil`

Todos verificados presentes en el HTML.

### El objeto `OFERTAS` en `ofertas.js`

**Segundo punto frágil del proyecto, junto con los `data-*`.**

Toda la información que no está en el HTML vive aquí, indexada por `oferta.dataset.indice`. Ese índice es **la posición de la oferta en el orden original del HTML** (0–20), asignado antes de cualquier ordenación.

```js
const OFERTAS = {
  0: {
    puesto: 'Auxiliar de tienda',
    empresa: 'Almacenes El Sol',
    tareas: ['…', '…', '…', '…'],
    requisitos: ['…', '…', '…', '…'],
    disponibilidad: { dias: ['lun','mar','mie','jue','vie'], franja: 'tarde' },
    disponibilidadExtra: { sab: 'manana' },
    habilidades: ['atención al cliente', 'ventas', 'caja', …],
    // Opcional: solo si la imagen del tipo no encaja
    imagen: { src: 'img/ofertas/agricultura.svg', alt: '…' },
  },
  …
};

// Después del bloque de ofertas:
const TIPO_VISUAL = {
  'Ventas': { src: 'img/ofertas/ventas.svg', alt: '…' },
  …
};
```

Reglas:

- El índice **no** sigue al orden visual. Si ordenas por salario, el modal sigue mostrando el detalle correcto, porque usa el índice original.
- Si **insertas** una oferta en medio del HTML, **todos los índices desde ahí se desplazan** y los datos se mezclan. Inserta siempre al final y añade el bloque con el índice siguiente.
- Si añades la oferta número 22, crea el bloque `21:`. Si no existe, el modal se abre sin tareas ni requisitos — no rompe, pero se ve vacío, y el puntaje de encaje tampoco aparecerá.
- Los días válidos son `lun, mar, mie, jue, vie, sab, dom`. Las franjas son `manana, tarde, noche`. Cualquier otro valor se ignora en silencio.
- `imagen` y las entradas de `TIPO_VISUAL` usan la **misma forma `{ src, alt }`**. Ver la advertencia en la sección 5.

### Claves de `localStorage`

| Clave | Contenido |
|-------|-----------|
| `perfil_nombre` | Campo nombre |
| `perfil_estudios` | Campo estudios |
| `perfil_habilidades` | Campo habilidades |
| `perfil_disponibilidad` | Campo disponibilidad |
| `theme` | `light` o `dark` |
| `encaje_disponibilidad` | Bloques libres marcados en la retícula, como array JSON de `"dia:franja"` |

---

## 6. Cómo trabajar

### Ver el sitio

```powershell
cd "C:\Users\laura\Desktop\Mi primera pagina web"
python -m http.server 8000
```

Abrir `http://127.0.0.1:8000/`

> Siempre por HTTP, **nunca** con doble clic (`file://`). Si ves la versión anterior, `Ctrl + Shift + R`.

### Añadir una oferta

1. Copiar un `<article class="tarjeta empleo">` en `buscar-empleos.html`
2. **Insertarlo siempre al final** de `#lista-empleos`, nunca en medio
3. Empezar por los `data-*`, usando **solo** valores de las tablas de la sección 4
4. Añadir badge si aplica: `<span class="badge-nuevo">Nuevo</span>` o `.badge-destacado`, dentro de `<p class="fecha">`
5. Añadir el bloque correspondiente en `OFERTAS` (`js/ofertas.js`), con **el índice siguiente** y con:
   - `puesto` y `empresa`
   - `tareas`: mínimo 4
   - `requisitos`: mínimo 4, que mencionen el tipo de trabajo y la empresa
   - `disponibilidad`: `{ dias: [...], franja: 'manana'|'tarde'|'noche' }`, y opcionalmente `disponibilidadExtra`
   - `habilidades`: 4 o 5 palabras clave para el puntaje de afinidad
   - `imagen`: solo si su contenido no encaja con el tipo (ver sección 5)
6. Si es una **ciudad nueva**, añadir el `<option>` a `#donde-buscar` (las 3 páginas) y a `#filtro-ciudad`
7. Actualizar `data-total-ofertas` en el `<body>` de `index.html`
8. No tocar CSS ni añadir `<img>`: la ilustración la inyecta `empleo.js`. Los filtros, el orden, el contador, "cargar más" y el modal se adaptan solos

Si debe salir además en el inicio, actualizar la tarjeta de `index.html`.

### Añadir color

Solo en `:root` de `css/estilos.css`. Nunca hex sueltos en el resto del archivo. Si el color debe funcionar en oscuro, redefinirlo en `[data-theme="dark"]`.

### Reglas

- Español en contenido y comentarios
- Clases en español, `kebab-case`
- Nada de emojis → Font Awesome con `aria-hidden="true"`
- Una clase, un bloque en el CSS (verificado: 0 duplicados)
- Toda animación necesita su alternativa bajo `prefers-reduced-motion`, en CSS **y** en JS
- El JS se ejecuta siempre dentro de `DOMContentLoaded`

---

## 7. Verificación

Comprobado el 1–2 de octubre de 2026:

| Comprobación | Resultado |
|--------------|-----------|
| Los 10 archivos JS pasan `node --check` | ✅ |
| Clases del HTML sin estilo en el CSS | ✅ ninguna (las restantes son prefijos de Font Awesome) |
| Selectores de clase duplicados en el CSS | ✅ 0 |
| Ids que el JS busca presentes en el HTML | ✅ 51/51 |
| Bloques `OFERTAS` alineados con los `<article>` del HTML | ✅ 21/21, índices 0–20 sin desalinear |
| `data-*` dentro de los valores de los `<option>` | ✅ 21/21 (tipo, horario y ciudad) |
| Cada oferta resuelve a un SVG que existe | ✅ 21/21 |
| SVG bien formados (`viewBox` + `<title>`) | ✅ 8/8 |
| SVG huérfanos (sin usar) | ✅ ninguno |
| Alt textos presentes | ✅ en las 21 ofertas |
| Tareas y requisitos de las ofertas nuevas | ✅ mínimo 4 y 4 |
| Texto corrupto (caracteres fuera del latín) | ✅ ninguno |
| Sin BOM en ningún archivo | ✅ |

> Los scripts de verificación se crean, se ejecutan y **se borran**. No hay suite de tests
> en el proyecto: si quieres repetir estas comprobaciones, hay que volver a escribirlos.

> No pude renderizar el sitio: el navegador de escritorio no está conectado a esta sesión.
> Conviene una revisión visual manual, en especial de las dos ilustraciones nuevas
> (`agricultura.svg` y `turismo.svg`), que nunca se han visto pintadas.

---

## 8. El modal de detalle

Nuevo componente. Al pulsar el título de una oferta o su botón "Inscribirme" se abre un diálogo con el detalle completo.

**Cómo funciona**

El modal es un único bloque en el HTML (al final de `<body>`) cuyo contenido se rellena desde JS. No se clona la tarjeta: se leen los campos sueltos (`.ubicacion`, `.salario strong`, `.descripcion`…) y se pinta el avatar original con su color de fondo.

El contenido largo —qué harás y requisitos— no está en el HTML: sale del objeto `DETALLES` (ver sección 4).

**Comportamiento de accesibilidad**

| Aspecto | Implementación |
|---------|----------------|
| Semántica | `role="dialog"` + `aria-modal="true"` + `aria-labelledby` al título |
| Cerrar | Botón, velo, `Escape` |
| Foco al abrir | Va al botón de cerrar |
| Foco al cerrar | Vuelve al elemento que lo abrió |
| Retención de foco | `Tab` cicla dentro del panel, sin salirse |
| Bloqueo de scroll | `.no-scroll` en `<body>` |
| Aviso de postulación | `#aviso` con `role="status"` y `aria-live="polite"` |

**Adaptación a móvil** — El modal sube desde abajo, pegado al borde inferior, ocupando el 92% del alto, y los botones del pie se apilan a ancho completo. Es el comportamiento habitual en móvil, más cómodo que un centro flotante.

**Animación** — Veleno y panel seLatestan con `opacity` + `translateY/scale`. Ambos pasan a opacidad 1 bajo `prefers-reduced-motion`, sin transformaciones.

---

## 9. Pendiente

**Alta**
- [ ] Revisión visual manual: 3 temas de responsive, modo oscuro, los 3 modales y las 2 ilustraciones nuevas
- [ ] Leer `Ficha_Definicion_Proyecto.docx` y contrastar con lo implementado (sigue sin abrirse)
- [ ] Los recuentos de los chips "búsquedas frecuentes" del inicio están escritos a mano ("2 trabajos"). Con 21 ofertas ya no cuadran. Se pueden derivar de los `data-tipo`, igual que el total

**Media**
- [ ] Persistir el orden y los filtros en la URL (se pierden al recargar)
- [ ] Encajar el puntaje de afinidad con `disponibilidad` del perfil, no solo con `habilidades`
- [ ] Renombrar archivos a `kebab-case` sin espacios
- [ ] Quitar `muestrario.html` y `muestrario-colores.html`, o moverlos a `legacy/`

**Baja**
- [ ] Favicon `.ico` real (ahora es un SVG inline repetido en cada HTML)
- [ ] Enlace directo a una oferta: `?oferta=3` para poder compartirla
- [ ] Script de verificación permanente, en vez de rehacerlo cada vez
- [ ] Revisar `SALARIO_MINIMO` en `sueldo.js`: es un valor de referencia y Colombia lo actualiza cada año

---

## 10. Registro de cambios

| Fecha | Cambio |
|-------|--------|
| 2026-10-01 | Estado inicial: tema Pop Vibrante, 9 ofertas, JS inline, CSS en `estilos.css/estilos.css` |
| 2026-10-01 | Reestructuración a `css/` y `js/`; carpeta antigua eliminada |
| 2026-10-01 | Accesibilidad: skip link, `aria-current`, `required`, Open Graph |
| 2026-10-01 | JS extraído a 5 módulos; perfil persistido en `localStorage` |
| 2026-10-01 | Rediseño a tema profesional (azul, bordes de 1px, sombras difusas) |
| 2026-10-01 | Header sticky con `backdrop-filter`, botón subir, animaciones de entrada |
| 2026-10-01 | 16 ofertas, badges "Nuevo" y "Destacado" |
| 2026-10-01 | Modo oscuro, partículas, inclinación 3D, barra de progreso |
| 2026-10-01 | **Limpieza**: CSS reescrito y deduplicado (0 selectores repetidos) |
| 2026-10-01 | **Orden funcional** por 6 criterios y **carga progressive** (8 por página) |
| 2026-10-01 | **Botón Limpiar** en el perfil, con confirmación |
| 2026-10-01 | Contadores de ofertas **derivados del HTML** (`data-total-ofertas`) |
| 2026-10-01 | `<noscript>` en las 3 páginas, `aria-hidden` en elementos decorativos |
| 2026-10-01 | Menú móvil: cierre con Escape y devolución del foco |
| 2026-10-01 | `DESIGN.md` actualizado al tema profesional (ya no describe el Pop) |
| 2026-10-02 | **Modal de detalle de oferta**: 4 tareas y 4 requisitos por puesto, `DETALLES` en `empleos.js` |
| 2026-10-02 | Modal con foco atrapado, cierre por `Escape` y devolución del foco al elemento de origen |
| 2026-10-02 | Aviso emergente `#aviso` al postular, con `role="status"` |
| 2026-10-02 | Modal adaptado a móvil (hoja inferior, botones apilados) y respeta `prefers-reduced-motion` |
| 2026-10-02 | **Ilustraciones propias**: 6 SVG, una por tipo, inyectadas por `empleo.js` |
| 2026-10-02 | La imagen de la oferta se reutiliza en el modal |
| 2026-10-02 | **Calculadora de encaje horario**: retícula 7×3, puntaje 0–100 por oferta |
| 2026-10-02 | **Puntaje de afinidad** entre las habilidades del perfil y los requisitos |
| 2026-10-02 | **Simulador de sueldo neto** con deducciones colombianas (estimación, no asesoría legal) |
| 2026-10-02 | **Generador de carta de presentación** con plantillas y portapapeles |
| 2026-10-02 | Datos de las 21 ofertas extraídos a `js/ofertas.js` (antes vivían en `empleos.js`) |
| 2026-10-02 | Corrección: el panel de encaje estaba dentro del grid y el filtro sticky lo tapaba al hacer scroll |
| 2026-10-02 | Corrección: la clave de disponibilidad se guardaba como `dia:franja` y se buscaba como `franja:dia` — todos los puntajes salían en 0 |
| 2026-10-02 | **5 ofertas de Pensilvania, Caldas** (21 en total) y el municipio en los 2 selects de ciudad |
| 2026-10-02 | 2 ilustraciones nuevas: `agricultura.svg` y `turismo.svg`, con el campo `imagen` por oferta |
| 2026-10-02 | Unificado `TIPO_VISUAL` e `imagen` a la forma `{ src, alt }` (el desajuste `img:`/`src:` ignoraba imágenes en silencio) |
| 2026-10-02 | Eliminados los BOM que PowerShell había añadido a 5 archivos |

---

*Actualiza esta hoja en el mismo cambio en que modifiques el estado del proyecto.*
