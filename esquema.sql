-- ============================================================================
--  esquema.sql — Base de datos de EstuTrabajo (Supabase / PostgreSQL)
-- ============================================================================
--
--  CÓMO USARLO
--  1. Entra a https://supabase.com/dashboard -> tu proyecto -> SQL Editor
--  2. Crea una consulta nueva ("New query")
--  3. Pega TODO este archivo y dale a "Run" / "Ejecutar"
--  4. Después ejecuta sql/semilla.sql en otra consulta para cargar las ofertas
--
--  Este script se puede volver a ejecutar sin romper nada.
-- ============================================================================


-- ============================================================================
--  1. EXTENSIONES
-- ============================================================================

-- Nombres de documentos: unique(), para que no se repitan
CREATE EXTENSION IF NOT EXISTS "pgcrypto";


-- ============================================================================
--  2. FUNCIÓN AUXILIAR
-- ============================================================================
--  Actualiza la columna "actualizado" cada vez que se modifica una fila.

CREATE OR REPLACE FUNCTION public.tocar_actualizado()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.actualizado = now();
  RETURN NEW;
END;
$$;


-- ============================================================================
--  3. TABLA: perfiles
-- ============================================================================
--  Un perfil por estudiante. Se crea solo al registrarse, con el correo
--  como nombre provisional; el estudiante lo completa después.
--
--  "id" es la misma clave que Supabase usa para el usuario: por eso cada
--  estudiante ve y edita únicamente su propia fila.

CREATE TABLE IF NOT EXISTS public.perfiles (
  id              uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email           text NOT NULL,
  nombre          text NOT NULL DEFAULT '',
  estudios        text NOT NULL DEFAULT '',
  habilidades     text NOT NULL DEFAULT '',
  disponibilidad  text NOT NULL DEFAULT '',
  ciudad          text NOT NULL DEFAULT '',
  creado          timestamptz NOT NULL DEFAULT now(),
  actualizado     timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.perfiles IS
  'Perfil del estudiante. Se crea automaticamente al registrarse.';

DROP TRIGGER IF EXISTS perfiles_tocar_actualizado ON public.perfiles;
CREATE TRIGGER perfiles_tocar_actualizado
  BEFORE UPDATE ON public.perfiles
  FOR EACH ROW EXECUTE FUNCTION public.tocar_actualizado();


-- ============================================================================
--  4. TABLA: ofertas
-- ============================================================================
--  Los puestos de trabajo. Antes vivían escritos en js/ofertas.js.

CREATE TABLE IF NOT EXISTS public.ofertas (
  id                serial PRIMARY KEY,

  -- Datos que ya existían en el HTML
  puesto            text NOT NULL,
  empresa           text NOT NULL,
  tipo              text NOT NULL,
  ciudad            text NOT NULL DEFAULT '',
  horario           text NOT NULL DEFAULT '',
  fecha_publicacion text NOT NULL DEFAULT '',
  es_nueva          boolean NOT NULL DEFAULT false,
  es_destacada      boolean NOT NULL DEFAULT false,

  -- Datos que ya existían en js/ofertas.js
  tareas            text[] NOT NULL DEFAULT '{}',
  requisitos        text[] NOT NULL DEFAULT '{}',
  habilidades       text[] NOT NULL DEFAULT '{}',
  dias_disponibles text[] NOT NULL DEFAULT '{}',
  franja            text NOT NULL DEFAULT '',

  -- Para los filtros
  salario           integer,
  salario_periodo   text NOT NULL DEFAULT 'mes' CHECK (salario_periodo IN ('mes', 'hora')),

  -- Imagen de la tarjeta
  imagen            text NOT NULL DEFAULT '',
  imagen_alt        text NOT NULL DEFAULT '',

  -- Control
  activa            boolean NOT NULL DEFAULT true,
  creado            timestamptz NOT NULL DEFAULT now(),

  -- Un mapa de tipos para filtrar rápido, en vez de recorrer toda la tabla
  CONSTRAINT ofertas_tipo_valido CHECK (
    tipo IN ('Ventas', 'Atención al cliente', 'Administración',
             'Servicios', 'Educación', 'Tecnología')
  )
);

CREATE INDEX IF NOT EXISTS ofertas_tipo_idx    ON public.ofertas (tipo);
CREATE INDEX IF NOT EXISTS ofertas_ciudad_idx  ON public.ofertas (ciudad);
CREATE INDEX IF NOT EXISTS ofertas_activa_idx  ON public.ofertas (activa);

COMMENT ON TABLE public.ofertas IS
  'Ofertas de empleo. Los datos se cargaron desde el HTML con sql/semilla.sql.';


-- ============================================================================
--  5. TABLA: postulaciones
-- ============================================================================
--  Qué estudiante se inscribió a qué oferta.
--  La restricción UNIQUE impide que alguien se postule dos veces a lo mismo.

CREATE TABLE IF NOT EXISTS public.postulaciones (
  id         serial PRIMARY KEY,
  usuario_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  oferta_id  integer NOT NULL REFERENCES public.ofertas(id) ON DELETE CASCADE,
  estado     text NOT NULL DEFAULT 'enviada'
             CHECK (estado IN ('enviada', 'en_revision', 'aceptada', 'rechazada')),
  creado     timestamptz NOT NULL DEFAULT now(),

  CONSTRAINT postulaciones_unica UNIQUE (usuario_id, oferta_id)
);

CREATE INDEX IF NOT EXISTS postulaciones_usuario_idx ON public.postulaciones (usuario_id);
CREATE INDEX IF NOT EXISTS postulaciones_oferta_idx  ON public.postulaciones (oferta_id);

COMMENT ON TABLE public.postulaciones IS
  'Postulaciones: un estudiante y una oferta. Solo se puede una vez por oferta.';


-- ============================================================================
--  6. CREAR EL PERFIL AL REGISTRARSE
-- ============================================================================
--  Cada vez que alguien crea una cuenta, se inserta su perfil en blanco.

CREATE OR REPLACE FUNCTION public.crear_perfil_al_registrarse()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.perfiles (id, email)
  VALUES (NEW.id, COALESCE(NEW.email, ''))
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS al_registrarse_crear_perfil ON auth.users;
CREATE TRIGGER al_registrarse_crear_perfil
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.crear_perfil_al_registrarse();


-- ============================================================================
--  7. SEGURIDAD (RLS)
-- ============================================================================
--  RLS = Row Level Security. Es lo que impide que un estudiante vea los datos
--  de otro. Sin esto, cualquiera podría leer todos los perfiles con la URL.
-- ============================================================================

ALTER TABLE public.perfiles      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ofertas       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.postulaciones ENABLE ROW LEVEL SECURITY;


-- --- perfiles: solo los suyos ---

DROP POLICY IF EXISTS perfiles_leer_suyo ON public.perfiles;
CREATE POLICY perfiles_leer_suyo ON public.perfiles
  FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS perfiles_crear_suyo ON public.perfiles;
CREATE POLICY perfiles_crear_suyo ON public.perfiles
  FOR INSERT WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS perfiles_editar_suyo ON public.perfiles;
CREATE POLICY perfiles_editar_suyo ON public.perfiles
  FOR UPDATE USING (auth.uid() = id)
             WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS perfiles_borrar_suyo ON public.perfiles;
CREATE POLICY perfiles_borrar_suyo ON public.perfiles
  FOR DELETE USING (auth.uid() = id);


-- --- ofertas: cualquiera puede verlas, solo un admin las cambia ---

DROP POLICY IF EXISTS ofertas_leer_todos ON public.ofertas;
CREATE POLICY ofertas_leer_todos ON public.ofertas
  FOR SELECT USING (true);

-- IMPORTANTE: no se crea ninguna política de INSERT / UPDATE / DELETE para
-- "ofertas". Con RLS activado, lo que no tiene política queda prohibido,
-- así que nadie puede crear ni modificar anuncios desde la web.
-- Las ofertas se administran desde el panel de Supabase
-- (Table Editor -> public.ofertas -> editar celdas y guardar).


-- --- postulaciones: cada uno ve y gestiona las suyas ---

DROP POLICY IF EXISTS postulaciones_leer_suyo ON public.postulaciones;
CREATE POLICY postulaciones_leer_suyo ON public.postulaciones
  FOR SELECT USING (auth.uid() = usuario_id);

DROP POLICY IF EXISTS postulaciones_crear_suya ON public.postulaciones;
CREATE POLICY postulaciones_crear_suya ON public.postulaciones
  FOR INSERT WITH CHECK (auth.uid() = usuario_id);

DROP POLICY IF EXISTS postulaciones_borrar_suya ON public.postulaciones;
CREATE POLICY postulaciones_borrar_suya ON public.postulaciones
  FOR DELETE USING (auth.uid() = usuario_id);


-- ============================================================================
--  8. PERMISOS
-- ============================================================================
--  La API de Supabase usa el rol "anon" (visitantes) y "authenticated"
--  (con sesión iniciada). Sin estos GRANT, las políticas de arriba no se aplican.

GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT                ON public.ofertas      TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.perfiles      TO authenticated;
GRANT SELECT, INSERT, DELETE ON public.postulaciones          TO authenticated;
GRANT USAGE, SELECT          ON ALL SEQUENCES IN SCHEMA public TO authenticated;


-- ============================================================================
--  9. VISTA DE CÓMO LEER UN PERFIL COMPLETO
-- ============================================================================
--  Útil para verificar que todo quedó bien desde el panel de Supabase.

CREATE OR REPLACE VIEW public.resumen_postulaciones AS
SELECT
  po.id,
  p.email,
  p.nombre,
  o.puesto,
  o.empresa,
  po.estado,
  po.creado
FROM public.postulaciones po
JOIN public.perfiles p ON p.id = po.usuario_id
JOIN public.ofertas  o ON o.id = po.oferta_id;

COMMENT ON VIEW public.resumen_postulaciones IS
  'Vista comoda para revisar las postulaciones con nombre y oferta.';