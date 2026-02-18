-- Crear la tabla 'anuncios'
CREATE TABLE IF NOT EXISTS public.anuncios (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    titulo TEXT NOT NULL,
    contenido TEXT NOT NULL,
    fecha_publicacion TIMESTAMPTZ DEFAULT NOW(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Habilitar Row Level Security
ALTER TABLE public.anuncios ENABLE ROW LEVEL SECURITY;

-- Política para que todos los usuarios autenticados (admin y padres) puedan leer los anuncios
CREATE POLICY "Permitir lectura a usuarios autenticados"
ON public.anuncios FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.profiles
        WHERE profiles.id = auth.uid()
        AND (profiles.role = 'admin' OR profiles.role = 'parent')
    )
);

-- Política para que solo los administradores puedan insertar anuncios
CREATE POLICY "Permitir inserción solo a administradores"
ON public.anuncios FOR INSERT
TO authenticated
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.profiles
        WHERE profiles.id = auth.uid()
        AND profiles.role = 'admin'
    )
);

-- Política para que solo los administradores puedan actualizar anuncios
CREATE POLICY "Permitir actualización solo a administradores"
ON public.anuncios FOR UPDATE
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.profiles
        WHERE profiles.id = auth.uid()
        AND profiles.role = 'admin'
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.profiles
        WHERE profiles.id = auth.uid()
        AND profiles.role = 'admin'
    )
);

-- Política para que solo los administradores puedan eliminar anuncios
CREATE POLICY "Permitir eliminación solo a administradores"
ON public.anuncios FOR DELETE
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.profiles
        WHERE profiles.id = auth.uid()
        AND profiles.role = 'admin'
    )
);
