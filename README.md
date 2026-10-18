# EstuTrabajo

**Empleos flexibles para estudiantes.**

EstuTrabajo es una web diseñada para conectar estudiantes con ofertas de empleo que se adaptan a sus horarios de estudio. Combina un diseño juvenil estilo "Pop Sticker" (bordes negros, sombras desplazadas y colores vibrantes) con funcionalidad real: búsqueda con filtros, vista previa en vivo del perfil y experiencia responsive.

## Tecnologías

- HTML5 semántico
- CSS3 con variables nativas (CSS Custom Properties)
- JavaScript Vanilla (sin dependencias)
- Font Awesome 6
- Diseño Mobile-First y accesible
- [Supabase](https://supabase.com) como base de datos y sistema de usuarios (opcional)

## Estructura del proyecto

```text
Mi primera pagina web/
├── index.html              # Página de inicio
├── buscar-empleos.html      # Búsqueda y filtrado de ofertas
├── mi-perfil.html           # Perfil del estudiante (con vista previa)
├── css/
│   └── estilos.css          # Estilos principales (temas claro y oscuro)
├── js/
│   ├── config.js             # ⭐ Datos de conexión a Supabase (lo único que editas)
│   ├── supabase.js           # Funciones para hablar con la base de datos
│   ├── auth.js               # Panel de registro / inicio de sesión
│   ├── postal.js             # Botón "Inscribirme" → tabla de postulaciones
│   ├── mis-postulaciones.js  # Lista y cancelación de postulaciones
│   ├── main.js               # Lógica común (navbar, accesibilidad)
│   ├── ofertas.js            # Datos de las ofertas (copia local de respaldo)
│   ├── empleo.js             # Inserta la ilustración de cada oferta
│   ├── empleos.js            # Filtros y búsqueda de empleos
│   ├── encaje.js             # Calculadora de encaje estudiante ↔ oferta
│   ├── sueldo.js             # Cálculo del sueldo estimado
│   ├── carta.js              # Carta de presentación
│   ├── perfil.js             # Formulario de perfil (nube + localStorage)
│   ├── stats.js              # Cifras animadas
│   └── theme.js              # Modo claro/oscuro con persistencia
├── sql/
│   ├── esquema.sql           # Tablas, seguridad (RLS) y automatismos
│   └── semilla.sql           # Carga inicial de las 21 ofertas
├── img/                     # Imágenes del proyecto (WebP y SVG)
├── .vercelignore            # Archivos que no se despliegan
├── DESIGN.md                # Guía de diseño (no se despliega)
├── HOJA-DE-CONTEXTO.md      # Contexto del proyecto (no se despliega)
├── Ficha_Definicion_Proyecto.docx
├── muestrario*.html         # Propuestas de diseño (no se despliegan)
└── README.md                # Este archivo
```

## Cómo abrirlo

Puedes abrir cualquier archivo `.html` directamente en tu navegador (doble clic). No requiere servidor ni instalación.

## Publicar en Vercel

El proyecto es 100% estático (sin Node, PHP ni base de datos), así que se despliega tal cual:

1. Entra en [vercel.com](https://vercel.com) y crea una cuenta.
2. Click en **Add New Project** y sube esta carpeta (o conecta tu repositorio de GitHub, que es lo recomendado: cada `push` publica automáticamente).
3. Vercel detecta el framework y publica. No hay nada que configurar en *Build Settings*.

El archivo `.vercelignore` evita que se publiquen los documentos internos del trabajo académico.

**Nota sobre los datos:** sin configurar Supabase, el perfil se guarda en el `localStorage` del navegador, es decir, solo en el dispositivo desde el que se escribió. Con Supabase configurado se guarda en la nube y se ve desde cualquier dispositivo.

## Características

- **Búsqueda inteligente**: El buscador de inicio envía parámetros a la página de empleos y aplica filtros automáticamente.
- **Filtros dinámicos**: Filtra por tipo de trabajo, ciudad, horario o palabra clave en tiempo real.
- **Perfil persistente**: Los datos se guardan en la base de datos de Supabase, así que los ves desde cualquier celular o computador. Sin cuenta, se guardan en el navegador del visitante.
- **Cuentas de usuario**: Registro e inicio de sesión con correo y contraseña.
- **Postulaciones**: El botón "Inscribirme" guarda la postulación del estudiante, que puede consultar y cancelar desde su perfil.
- **Vista previa en vivo**: Mientras escribes tu perfil, ves cómo quedará en tiempo real.
- **Responsive**: Optimizado para móvil, tablet y escritorio.
- **Accesible**: Usa etiquetas correctas, `:focus-visible`, skip-link y ARIA donde corresponde.

## Base de datos (opcional)

El proyecto trae una base de datos completa preparada en Supabase: tres tablas
(`perfiles`, `ofertas`, `postulaciones`), reglas de seguridad para que cada
estudiante solo vea lo suyo, y la carga inicial de las 21 ofertas.

**No es obligatoria.** Mientras no se configure, la web funciona exactamente
igual que antes, guardando el perfil en el navegador.

Para conectarla, sigue la guía paso a paso de
[`COMO-CONECTAR-LA-BASE-DE-DATOS.md`](COMO-CONECTAR-LA-BASE-DE-DATOS.md).
En resumen: crear un proyecto gratuito en supabase.com, ejecutar `sql/esquema.sql`
y `sql/semilla.sql` en su editor SQL, y pegar dos claves en `js/config.js`.

## Diseño

El estilo visual sigue la guía definida en [`DESIGN.md`](DESIGN.md) (tema **Pop Vibrante** - Opción D, paleta **V2 · Lima Pop**).

## Autor

Proyecto académico - Diseño de Interfaces Web.

## Versión

1.0.0
