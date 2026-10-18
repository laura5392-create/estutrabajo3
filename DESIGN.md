# EstuTrabajo — Sistema de diseño

> Tema **Profesional**, inspirado en portales de empleo reales (LinkedIn Jobs, Indeed, Glassdoor).
> Audience: estudiantes de 16–25 años, Colombia, **mobile-first**.
> Tipografía: **Baloo 2** (títulos) + **Inter** (cuerpo).

**Fuente de verdad:** este documento. El código (`css/estilos.css`) debe derivarse de aquí.
Si cambia el CSS, cambia también este archivo.

---

## 1. Tokens — Color

| Nombre | Valor | Token | Rol |
|--------|-------|-------|-----|
| BG | `#F5F7FA` | `--bg` | Fondo de página, gris muy suave |
| Surface | `#FFFFFF` | `--surface` | Tarjetas, formularios, header |
| Surface Alt | `#FAFBFC` | `--surface-alt` | Inputs, hover de superficie |
| Primary | `#0F7BFF` | `--primary` | Botones, enlaces, iconos de ubicación |
| Primary Hover | `#0E6FE6` | `--primary-hover` | Estado hover de botones |
| Primary Light | `rgba(15,123,255,.08)` | `--primary-light` | Fondos de chip, halo de foco |
| Success | `#16A34A` | `--success` | Badge "Nuevo", confirmación |
| Warning | `#F59E0B` | `--warning` | Badge "Destacado", error de validación |
| Text 1 | `#1F2937` | `--text-primary` | Títulos y texto fuerte |
| Text 2 | `#4B5563` | `--text-secondary` | Párrafos, descripciones |
| Text 3 | `#6B7280` | `--text-tertiary` | Metadatos, fechas |
| Muted | `#9CA3AF` | `--text-muted` | Placeholders, valores vacíos |
| Border | `#E5E7EB` | `--border` | Bordes de tarjeta, input, divisor |
| Border Light | `#F1F3F5` | `--border-light` | Separadores internos |

### Tema oscuro

Se activa con `[data-theme="dark"]` en `<html>`. **Solo redefine tokens**, nunca reglas completas.

| Token | Claro | Oscuro |
|-------|-------|--------|
| `--bg` | `#F5F7FA` | `#0B1220` |
| `--surface` | `#FFFFFF` | `#151E2E` |
| `--surface-alt` | `#FAFBFC` | `#1B2536` |
| `--primary` | `#0F7BFF` | `#3B82F6` |
| `--text-primary` | `#1F2937` | `#F1F5F9` |
| `--text-secondary` | `#4B5563` | `#CBD5E1` |
| `--text-tertiary` | `#6B7280` | `#94A3B8` |
| `--border` | `#E5E7EB` | `#2A3648` |

El pie de página **nunca** cambia: siempre `#0F172A`.

### Reglas de contraste

- Texto blanco **solo** sobre `--primary` o sobre fondos oscuros.
- El texto de la banda CTA es blanco porque el fondo es azul sólido.
- `badge-destacado` usa texto **muy oscuro** (`#1F1300`) sobre ámbar: el blanco falla aquí.
- El foco visible es siempre azul de 2px con `outline-offset: 2px`.

---

## 2. Tokens — Tipografía

| Elemento | Familia | Peso | Tamaño |
|----------|---------|------|--------|
| h1 del héroe | Baloo 2 | 700 | `clamp(2rem, 4vw, 2.75rem)`, line-height 1.15, letter-spacing -0.03em |
| h1 interior | Baloo 2 | 700 | `clamp(1.5rem, 2.5vw, 2rem)` |
| h2 de sección | Baloo 2 | 700 | `clamp(1.5rem, 2.5vw, 2rem)` |
| h3 (empleo) | Baloo 2 | 700 | 18px, line-height 1.35 |
| h3 (paso) | Baloo 2 | 700 | 18px |
| Cuerpo | Inter | 400 | 14px, line-height 1.6 |
| Párrafo destacado | Inter | 400 | 15–16px, line-height 1.7 |
| Metadatos | Inter | 400/500 | 13–14px, `--text-tertiary` |
| Etiqueta superior | Inter | 600 | 13px, mayúsculas, letter-spacing 0.02em, `--primary` |
| Badge | Inter | 700 | 11px, mayúsculas |

---

## 3. Tokens — Formas y sombras

| Elemento | Valor | Token |
|----------|-------|-------|
| Tarjetas | 16px | `--radius-lg` |
| Botones, inputs | 12px | `--radius-md` |
| Tags, chips de menú | 999px (píldora) | `--radius-pill` |
| Avatar | 50% | — |

| Sombra | Valor | Uso |
|--------|-------|-----|
| `--shadow-xs` | `0 1px 2px rgba(15,23,42,.04)` | Reposo de tarjetas y botones |
| `--shadow-sm` | `0 1px 3px rgba(15,23,42,.08)` | Hover de botón, header al scrollear |
| `--shadow-md` | `0 4px 12px -2px rgba(15,23,42,.10)` | Hover de tarjeta, banda CTA |
| `--shadow-lg` | `0 12px 32px -8px rgba(15,23,42,.16)` | Botones flotantes, menú móvil |

**Regla:** bordes de **1px** `--border`, nunca 2px. Sombras difusas, nunca sombras duras desplazadas.

---

## 4. Movimiento

| Token | Valor |
|-------|-------|
| `--ease-out` | `cubic-bezier(0.16, 1, 0.3, 1)` |
| `--dur-fast` | 0.15s (hover, color) |
| `--dur-base` | 0.2s (transform, caja) |

- **Hover en tarjeta:** `translateY(-3px)` + `--shadow-md` + borde azul al 30%.
- **Hover en botón:** `translateY(-2px)` + `--shadow-sm`.
- **Botón activo:** `translateY(0) scale(0.98)`.
- **Barrido de luz:** pseudo-elemento `::after` que entra desde `left: -100%` hasta `100%` en 0.7s al hover.
- **Onda de botón:** `::after` radial que crece a 320px en 0.5s al `:active`.
- Todo debe funcionar bajo `prefers-reduced-motion: reduce`.

---

## 5. Componentes

### Botón `.boton`
Sólido `--primary`, texto blanco, 44px de alto mínimo, radio 12px, padding `0 24px`, sombra xs.
Hover: fondo `--primary-hover`, sube 2px, sombra sm. Activo: baja y encoge 0.98.

**Variantes**
- `.boton-ghost` / `.boton-limpiar` — fondo `--surface`, borde `--border`, texto `--text-primary`. Hover: borde azul.
- `.boton-exito` — fondo `--success`, texto blanco. Se aplica al confirmar el perfil.
- `.enlace` — texto `--primary` sin subrayado; subrayado al hover.
- `.inscribirme` — botón compacto (9px 20px, 13px) de cada tarjeta de empleo, alineado a la derecha.

### Barra de navegación
Header sticky con `backdrop-filter: blur(14px)`. Al hacer scroll gana `--shadow-sm` (`.encabezado-scroll`).

- `.marca` — birrete en `--primary` + "EstuTrabajo" en Baloo 700.
- `.menu a` — texto `--text-secondary`, subrayado animado que crece desde el centro al hover.
- `.menu a.activo` — píldora azul sólida, texto blanco, sin subrayado.
- CTA "Ver ofertas" a la derecha (se oculta en móvil).
- `.menu-toggle` — hamburguesa de 3 barras que rota a X. Se inyecta por `main.js`.

### Buscador principal `.busqueda-principal`
Banda `--surface-alt` con borde inferior. Formulario flex de 3 partes: campo "Qué", select "Dónde", botón.
Envía por GET a `buscar-empleos.html?busqueda=…&ciudad=…`.

Los tres campos van separados por 10px de hueco, cada uno con su propio borde y su propio radio de 12px. El foco produce un halo azul de 3px **sobre el campo completo**, no solo sobre el input: el borde y el halo pertenecen a `.campo-busqueda`, no a `input`.

### Héroe `.hero`
Grid `1.05fr 0.95fr`: texto a la **izquierda**, imagen a la derecha. En ≤1024px pasa a una columna centrada.

- `.hero-tag` — píldora con fondo `--primary-light` y texto azul.
- `.resaltado` — la palabra clave del h1 en azul, sin subrayado ni marca.
- `.hero-nota` — texto terciario con rayo azul.
- `.tarjeta-imagen` — marco de 8px, radio 16px, sombra md, imagen de 420px con `object-fit: cover`, reflejo diagonal sutil encima.
- `.chip-sol` — "Horario flexible", arriba izquierda, superficie translúcida.
- `.chip-rosa` — "Medio tiempo", abajo derecha, azul sólido con texto blanco.
- Detrás de todo, un gradiente muy tenue que se desplaza lentamente (16s).

### Estadísticas `.stat`
Tarjeta blanca, número en Baloo 700 de 28px, etiqueta en terciario.
Los números se **animan de 0 al valor** con easingOutCubic cuando entran en pantalla.
La cifra de ofertas se inyecta desde `data-total-ofertas` para no desincronizarse.

### Chips de búsqueda frecuente `.frecuente`
Tarjeta blanca con el nombre del tipo en 600 y el recuento de ofertas en terciario.
Enlace a `buscar-empleos.html?tipo=…`. Hover: sube 3px, borde azul, barrido de luz.

### Pasos `.paso`
Tarjeta con número en **círculo azul** de 40px, título Baloo 700 y texto secundario.

### Tarjeta de empleo `.empleo`
Tarjeta blanca, orden de lectura:
1. `.fecha` — "Hoy" / "hace 3 días", alineado a la derecha, con badges opcionales
2. `.titulo-empleo` — Baloo 700 18px, hover a azul
3. `.ubicacion` — pin azul + ciudad en terciario
4. `.empresa` — avatar circular 36px + nombre en 600
5. `.salario` — cifra en 700 18px + periodicidad en terciario
6. `.etiquetas-trabajo` — `.tag-tipo` (fondo azul claro, texto azul) y `.tag-horario` (gris claro)
7. `.descripcion` — texto secundario, line-height 1.7
8. `.inscribirme` — botón azul compacto (9px 20px, 13px), alineado a la derecha

**Ilustración** `.empleo-imagen`
Franja de 150px en la cabecera de la tarjeta, con sangrado negativo (`margin: -20px -24px 16px`) para que rompa el borde de la tarjeta. La imagen usa `object-fit: cover` y hace un `scale(1.04)` al hover.

**Badges**
- `.badge-nuevo` — verde `--success`, texto blanco, pulso suave de escala (2.4s).
- `.badge-destacado` — ámbar `--warning`, texto muy oscuro.

**El badge no va en `.fecha`.** `js/empleo.js` lo mueve a `.empleo-imagen` y lo posiciona arriba a la derecha, superpuesto a la imagen. En el HTML el badge sigue escrito dentro de `<p class="fecha">` por legibilidad del marcado; el script lo reubica.

### Banda CTA `.cta-band`
Franja azul sólida con barrido de brillo continuo (3.5s). h2 en blanco, párrafo blanco al 92%, botón blanco con texto azul. En móvil: columna centrada.

### Panel de filtros `.panel-filtros`
Columna de 280px, sticky en escritorio (`top: header + 16px`). Grupos separados por líneas de 1px. Controles con radio 12px, borde 1px y foco azul con halo.

### Resultados y orden
- `.resultado-meta` — fila con contador a la izquierda y select de orden a la derecha, entre líneas de 1px.
- El contador usa singular/plural correcto: "1 oferta disponible" / "N ofertas disponibles".
- `.sin-resultados` — tarjeta centrada con icono de lupa. Aparece cuando no hay coincidencias.
- `.cargar-mas` — botón fantasma centrado. Solo visible si quedan ofertas por mostrar. Se muestran 8 ofertas por página.

### Modal de detalle `.modal`
Se abre al pulsar el título de una oferta o su botón "Inscribirme".

- `.modal-velo` — fondo `rgba(15,23,42,.55)` con `backdrop-filter: blur(3px)`, opacidad 0 → 1.
- `.modal-panel` — tarjeta de 620px máximo, alto máximo 88vh, `overflow` interno para que el cuerpo desplace.
- Entrada: `opacity 0` + `translateY(16px) scale(0.98)` → `opacity 1` + sin transformación, en 0.22s.
- `.modal-cabecera` — avatar de la empresa (conserva su color original), ciudad, título y compañía; botón de cierre circular a la derecha.
- `.modal-imagen` — franja de 180px con la misma ilustración de la tarjeta. Lleva `alt=""`: es decorativa, el título del diálogo ya identifica la oferta.
- `.modal-cuerpo` — salario grande, tags, y bloques `h3` en mayúsculas con viñeta azul.
- `.modal-lista li::before` — punto de 6px en `--primary`.
- `.modal-pie` — fondo `--surface-alt`, borde superior, dos botones a la derecha.
- En **móvil**: el panel se pega al borde inferior, `border-radius` solo arriba, alto 92vh, botones apilados a ancho completo.

### Aviso emergente `.aviso`
Franja fija abajo y centrada, fondo `--text-primary` sobre texto `--surface`. Sube 12px al entrar. Se usa para confirmar la postulación.

### Formulario de perfil
Rejilla `1.15fr 0.85fr`: formulario a la izquierda, vista previa a la derecha (sticky en escritorio).
Campos con radio 12px, hover con borde al 40% de azul, foco con halo y `translateY(-1px)`.
`.campo input:user-invalid` — borde ámbar y fondo `warning-light` (validación nativa del navegador).
`.formulario-acciones` — dos botones a la mitad de ancho (Guardar / Limpiar).

### Vista previa `.vista-previa`
Tarjeta blanca sticky. Avatar circular azul de 64px con `fa-user`. Cada `.dato-vista` tiene etiqueta en mayúsculas (terciario) y valor en 600. Un valor sin escribir recibe la clase `.vacio` y se muestra en `--text-muted`.

### Pie de página
**Siempre** `#0F172A`, incluso en tema oscuro. Tres columnas: marca (2fr), Páginas, Contacto. Títulos en blanco con icono azul. Enlaces con subrayado que crece al hover. Copyright con borde superior translúcido.

---

## 6. Elementos flotantes

| Elemento | Posición | Comportamiento |
|----------|----------|----------------|
| Elemento | Posición | Comportamiento |
|----------|----------|----------------|
| `.back-to-top` | Abajo **derecha** | Aparece a 300px de scroll, 48px, circular |
| `.theme-toggle` | Abajo **izquierda** | Siempre visible, alterna claro/oscuro |
| `.scroll-progress` | Pegado arriba | Anillo de 3px, ancho = % de scroll |
| `.modal` | Cobertura completa | z-index 120, por encima del header |
| `.aviso` | Abajo centrado | z-index 130, se oculta solo tras 3,2s |

Los dos flotantes se separan en esquinas opuestas para no solaparse en móvil (16px de margen).
El `.aviso` ocupa la franja inferior central, entre ambos, por eso sube 28px en escritorio.

---

## 7. Responsive

| Breakpoint | Cambios |
|------------|---------|
| **≤1024px** | Héroe a 1 columna centrada · stats, tarjetas y frecuentes a 2 columnas · filtros y vista previa dejan de ser sticky · footer a 2 columnas |
| **≤760px** | Menú hamburguesa a pantalla completa con overlay · buscador en columna · tarjetas, stats y frecuentes a 1 columna · CTA centrado · footer a 1 columna · flotantes a 42px con 16px de margen · modal como hoja inferior con botones apilados |
| **≤420px** | Título del héroe a 1.75rem · CTAs y botón Inscribirme a ancho completo · contenedor con 24px de margen |

---

## 8. Reglas del proyecto

### Do
- Usar **siempre** los tokens de `:root`; nunca valores hex sueltos.
- Bordes de **1px** con `--border`. Separadores internos con `--border-light`.
- Azul para toda acción; verde solo para confirmación; ámbar solo para avisos.
- Una sola sombra "plana" por estado. Nada de sombras desplazadas duras.
- Íconos de Font Awesome con `aria-hidden="true"`; el texto lleva el significado.
- Todo elemento inyectado por JS debe degradar bien si el JS falla.
- Respetar `prefers-reduced-motion` en CSS **y** comprobarlo en JS.

### Don't
- No reintroducir el tema Pop (lima `#C6F24E`, frambuesa `#FF4D8D`, bordes negros de 2px, Baloo 800). Ese tema está reemplazado.
- No emojis: siempre Font Awesome.
- No más de una barra de búsqueda por página.
- No declarar la misma clase dos veces en el CSS. Un componente, un bloque.
- No usar `:focus-visible` con `outline: none`.
- No dejar valores mágicos: si un número se repite, es un token.
- No escribir `<img>` en el HTML de las ofertas: `empleo.js` las inyecta por `data-tipo`.
- Ilustraciones **SVG propias**, nunca fotos de stock (licencia) ni imágenes rotas (404).

---

## 9. Ilustraciones

Las ofertas usan ilustraciones SVG dibujadas para el proyecto, en `img/ofertas/`. Hay **8**.

**Por que SVG y no fotos:** no hay acceso a internet para descargar imagenes, y las fotos de stock tienen licencia. El SVG pesa ~3,5 KB y se ve nitido en cualquier pantalla.

### Por tipo de trabajo (6)

| Tipo | Archivo | Contenido |
|------|---------|-----------|
| Ventas | `ventas.svg` | Toldo, estanteria, mostrador, caja y bolsa |
| Atencion al cliente | `atencion.svg` | Auriculares, pantalla de chat, reloj |
| Administracion | `administracion.svg` | Carpetas, hojas, portatil, graficas |
| Servicios | `servicios.svg` | Cafe, galleta, libro abierto, lampara |
| Educacion | `educacion.svg` | Pizarra, lapiz, cuaderno, bombilla |
| Tecnologia | `tecnologia.svg` | Codigo, nodos, smartphone, corchetes |

### Por oferta concreta (2)

Estas **anulan** la del tipo, porque su contenido no encaja en ningun tipo generico:

| Oferta | Archivo | Contenido |
|--------|---------|-----------|
| Supervisor de finca cafetera | `agricultura.svg` | Cafetal en ladera, montanas, cereza de cafe, canasta, etiqueta +kg |
| Guia de ruta del cafe | `turismo.svg` | Sendero junto al rio, grupo de visitantes, cartel Ruta del cafe, aves |

Sin este mecanismo, ambas habrian salido con el dibujo de una **cafeteria**, que es lo que
devuelve `Servicios`. Ese fue el motivo de crearlo.

### Orden de resolucion

1. `OFERTAS[indice].imagen` - imagen propia de la oferta
2. `TIPO_VISUAL[data-tipo]` - la del tipo de trabajo
3. `TIPO_VISUAL['Ventas']` - ultimo recurso

**Reglas al crear o editar una ilustracion**

- `viewBox="0 0 800 500"`, con `role="img"` y `width`/`height` fijos
- Un `<title>` descriptivo como **primer hijo** de `<svg>` (obligatorio para accesibilidad)
- `object-fit: cover` en CSS, asi que el encuadre es flexible
- Paleta coherente con el tema: fondos muy claros, un acento por categoria
- El `alt` describe **la ilustracion**, no la oferta
- `imagen` y `TIPO_VISUAL` usan la **misma forma `{ src, alt }`**

Al anadir un tipo nuevo hay que tocar: el SVG, `TIPO_VISUAL` y los `<select>` de filtros.
Al anadir una imagen para una sola oferta basta con el SVG y el campo `imagen` de esa oferta.

---

## 10. Accesibilidad

- `lang="es"`, un solo `h1` por página, jerarquía sin saltos.
- Labels asociados por `for`/`id` en **todos** los campos.
- `aria-current="page"` en el enlace de navegación activo.
- `aria-expanded` en el hamburger; se cierra con Escape y devuelve el foco.
- `aria-live="polite"` en el contador de resultados y en el aviso de postulación.
- `noscript` visible en las tres páginas.
- Skip link como primer elemento del `<body>`.
- Iconos decorativos siempre con `aria-hidden="true"`.

### Modal

Un diálogo, por lo tanto todo lo que exige un diálogo:

- `role="dialog"` + `aria-modal="true"` + `aria-labelledby` apuntando al `<h2>` del título.
- Se cierra con botón, velo y `Escape`.
- Al abrir, el foco va al botón de cierre. Al cerrar, **vuelve al elemento que lo abrió**.
- El foco queda **atrapado** dentro del panel mientras está abierto: `Tab` cicla en los dos sentidos.
- El fondo no se desplaza (`.no-scroll` en `<body>`).

---

## 11. Quick reference

```text
Claro    bg #F5F7FA · surface #FFFFFF · primary #0F7BFF · text #1F2937 · border #E5E7EB
Oscuro   bg #0B1220 · surface #151E2E · primary #3B82F6 · text #F1F5F9 · border #2A3648
Footer   #0F172A (fijo)
Radios   8 / 12 / 16 / 999px
Sombras  xs → sm → md → lg
```
