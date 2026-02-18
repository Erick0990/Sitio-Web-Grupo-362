-- 1. Asegurar que RLS esté activo pero con políticas correctas
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 2. ELIMINAR políticas viejas que puedan estar rotas
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;

-- 3. CREAR la política maestra de lectura (La llave del candado)
CREATE POLICY "Users can view own profile"
ON public.profiles FOR SELECT
USING (auth.uid() = id);

-- 4. Asegurar usuario Admin
UPDATE public.profiles SET role = 'admin' WHERE email = 'erickgonzalezmatarrita@hotmail.com';
