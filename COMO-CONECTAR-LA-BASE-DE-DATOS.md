# Cómo conectar la base de datos de EstuTrabajo

Esta guía es para quien nunca ha usado Supabase. **Son unos 20 minutos, la primera
vez.** Después el proyecto ya guarda los perfiles en la nube.

Al terminar vas a tener:

- ✅ Cuentas de usuario (registro con correo y contraseña)
- ✅ Perfiles guardados en la nube (los ves desde el celular y el computador)
- ✅ 21 ofertas de empleo en la base de datos
- ✅ Postulaciones (el botón "Inscribirme" guarda de verdad)

---

## Antes de empezar

Todo esto funciona sin instalar nada. No necesitas Node, ni Python, ni XAMPP,
ni una base de datos en tu computador. Solo un navegador.

Y si algo sale mal, **el sitio sigue funcionando**: mientras no configures
Supabase, la web guarda todo en el navegador como siempre lo ha hecho.

---

## Paso 1 — Crear tu cuenta y proyecto en Supabase

1. Entra a **https://supabase.com**
2. Click en **Start your project**
3. Inicia sesión con GitHub o Google (es lo más rápido)
4. Rellena el formulario:
   - **Organization / Name**: el nombre que quieras, por ejemplo `estutrabajo`
   - **Database password**: inventa una contraseña y **guárdala**. Es la de tu
     base de datos. Si se te olvida, puedes restablecerla, pero es un enredo.
   - **Region**: elige la más cercana a ti, por ejemplo **Bogotá** o
     **US East (North Virginia)**. Da igual para este proyecto, pero una
     región cercana hace la página más rápida en Colombia.
   - **Plan**: el **gratuito**. Está bien para un trabajo académico y alcanza
     de sobra.
5. Click en **Create new project**
6. Espera 1-2 minutos mientras se crea. Verás un tablero verde: eso significa
   que tu base de datos ya existe.

---

## Paso 2 — Copiar las dos claves

Siendo beginner: la base de datos ya está creada, pero la web necesita dos
"claves" para poder hablar con ella. Están en el panel.

1. En el menú de la izquierda, click en el **engranaje** (Project Settings)
2. Abajo del todo, en el menú lateral, click en **API** (antes se llamaba
   "API Keys")
3. Copia estos dos valores:

| Dato | Dónde está | Se ve así |
|---|---|---|
| **Project URL** | Campo "Project URL" | `https://abcdefgh.supabase.co` |
| **Publishable key** | Campo "Publishable key" (antes "anon public") | una línea larga que empieza con `sb_publishable_` |

> **Importante:** hay dos claves en esa pantalla: la **publishable** y la
> **secret** (antes `service_role`). Copia la **publishable** nada más. La
> secret da acceso total a la base de datos y **nunca debe publicarse** en un
> sitio web.

---

## Paso 3 — Pegar las claves en el proyecto

Abre el archivo **`js/config.js`** y reemplaza los dos textos marcados:

```js
const CONFIG_SUPABASE = {
  URL: 'https://abcdefgh.supabase.co',          // ← tu Project URL
  CLAVE: 'sb_publishable_xxxxxxxxxxxx',          // ← tu Publishable key
  ...
};
```

Esas dos líneas son **lo único que tienes que editar en todo el proyecto**.

> No te preocupes: esa clave está hecha para usarse en el navegador, es
> pública a propósito. Lo que protege tus datos no es la clave, son las reglas
> de seguridad que se instalan en el Paso 4. Por eso esa parte es obligatoria.

---

## Paso 4 — Crear las tablas (lo importante)

Esta parte es la que realmente pone la base de datos.

1. En el panel de Supabase, en el menú de la izquierda, click en **SQL Editor**
2. Click en **New query**
3. Abre el archivo **`sql/esquema.sql`** de este proyecto, copia **todo** su
   contenido y pégalo en el editor
4. Click en **Run** (o el botón ▶️ de abajo a la derecha)

Verás un mensaje verde de éxito. Listo: ya existen las tablas `perfiles`,
`ofertas` y `postulaciones`, con las reglas de seguridad activadas.

> **¿Qué hace este archivo, en simple?**
> - Crea tres "cajas" donde guardar datos: `perfiles`, `ofertas`, `postulaciones`
> - Activa la seguridad (RLS) para que **nadie pueda ver los datos de otro**
> - Crea un "automatismo" que, cuando alguien se registra, le crea su perfil solo

---

## Paso 5 — Cargar las 21 ofertas

1. En el **SQL Editor**, click en **New query** (otra pestaña nueva)
2. Abre **`sql/semilla.sql`**, cópialo todo y pégalo
3. Click en **Run**

Verás el mensaje `Success. No rows returned` (o algo similar). Eso está bien:
significa que las ofertas quedaron guardadas.

**Para verificarlo**, ve al menú **Table Editor** → `ofertas`. Debes ver 21 filas
con los nombres de los puestos: "Auxiliar de tienda", "Atención al cliente",
"Asistente administrativo", etc.

---

## Paso 6 — Probar que funciona

1. Abre el sitio en tu navegador.
2. Entra a **Mi perfil**.
3. Ahora debe aparecer arriba un panel nuevo llamado **"Mi cuenta"**, que antes
   no existía.
4. Escribe un correo tuyo, una contraseña de 6 caracteres o más, y dale a
   **Crear cuenta**.
5. Revisa tu correo: Supabase te manda un mensaje de confirmación. Ábrelo y haz
   click en el botón de confirmación.
6. Vuelve al sitio, escribe el mismo correo y contraseña, y dale a **Entrar**.
7. Llena tu perfil y dale a **Guardar perfil**.
8. Abre la página de **Buscar empleos** y mira que el botón de la oferta diga
   **"Inscribirme"**. Púlsalo.

**Si todo salió bien**, en el panel de Supabase (Table Editor):
- `perfiles` tiene tu fila con lo que escribiste
- `postulaciones` tiene una fila con tu postulación

También deberías ver una sección **"Mis postulaciones"** al final de la página de
perfil.

---

## Problemas frecuentes

### El panel "Mi cuenta" no aparece

Casi siempre significa que `js/config.js` sigue con los textos
`PEGUE-AQUI-...`. Revisa que hayas pegado bien la URL y la clave, y que
guardaste el archivo.

Para comprobarlo, abre la consola del navegador (`F12` → pestaña **Console**).
Si ves esto:

```
[EstuTrabajo] Supabase NO está configurado todavía.
```

es que falta pegar las claves.

### "The CORS request failed" o "Failed to fetch"

Suele ser que pegaste la URL mal. Debe empezar por `https://` y terminar en
`.supabase.co`, **sin nada después** (sin `/` al final).

### "Invalid login credentials"

El correo o la contraseña no coinciden. Si te registraste hace un momento y no
has confirmado el correo de Supabase, ese es el problema.

### "User already registered"

Ya existe una cuenta con ese correo. Usa **Entrar** en vez de **Crear cuenta**.

### Creé una cuenta y no puedo iniciar sesión

Casi siempre es el correo de confirmación. Revisa la bandeja de entrada (y la
de spam) y busca un mensaje de Supabase.

Si estás probando mucho y molesta, puedes desactivar el correo obligatorio en
Supabase: **Authentication → Sign In / Providers → Email** y desmarca
**Confirm email**. Solo para desarrollo; para un sitio real déjalo marcado.

### Se guardó en el navegador y no en la nube

Significa que estás usando la web sin haber iniciado sesión. El formulario
guarda en el navegador cuando no hay cuenta, para que no se pierda lo que
escribes mientras tanto. En cuanto inicias sesión, pasa a la base de datos.

---

## Volver a cargar las ofertas

Si más adelante cambias los datos de alguna oferta editando
`sql/semilla.sql`, vuelve a ejecutarlo en el SQL Editor para actualizar la base
de datos.

**Ojo:** el archivo empieza con un `TRUNCATE` que borra la tabla de ofertas
antes de recargar. Eso mantiene los identificadores iguales, pero **borra
también las postulaciones** que dependan de ellas. Si solo vas a cambiar textos,
te conviene editar las celdas directamente desde **Table Editor → ofertas**, que
no borra nada.

---

## Cómo se administran las ofertas

A propósito, las ofertas **no** se pueden crear ni modificar desde la web. Se
administran desde el panel de Supabase (**Table Editor → ofertas**), porque
cualquier visitante podría usar el navegador para enviar cambios si se lo
permitiéramos.

Si en el futuro quieres un panel de administración dentro de la web, hay que
agregar un concepto nuevo: el **rol de administrador**, que solo tengan ciertas
cuentas. Se puede hacer, pero es el siguiente paso, no este.

---

## Resumen rápido

| Paso | Qué haces |
|---|---|
| 1 | Crear cuenta y proyecto en supabase.com (plan gratuito) |
| 2 | Copiar Project URL y Publishable key de Project Settings → API |
| 3 | Pegarlas en `js/config.js` |
| 4 | Ejecutar `sql/esquema.sql` en el SQL Editor |
| 5 | Ejecutar `sql/semilla.sql` en el SQL Editor |
| 6 | Registrarte en el sitio y probar |

**Archivos que hay que tocar a mano: uno.** `js/config.js`.

---

## Si todo esto te parece demasiado

También es una respuesta perfectamente válida. La web funciona sin base de
datos: guarda los datos en el navegador de cada visitante. Para un trabajo
académico eso puede ser más que suficiente, y queda mucho más simple de
explicar.

Lo que sí conviene caber, sin embargo, es el límite: con localStorage, el perfil
que alguien llena en el computador **no aparece en el celular**, y se pierde si
borra los datos del navegador. La base de datos resuelve justamente eso.