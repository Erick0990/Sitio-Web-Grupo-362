-- fix_profiles_rls_and_data.sql

-- 1. Reset RLS to clear any weird states
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 2. Drop existing SELECT policies to avoid conflicts
-- We try to drop any policies that might exist related to reading
DROP POLICY IF EXISTS "Permitir lectura propia" ON public.profiles;
DROP POLICY IF EXISTS "Public profiles are viewable by everyone." ON public.profiles;
DROP POLICY IF EXISTS "Users can see own profile" ON public.profiles;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.profiles;

-- 3. Create bulletproof SELECT policy
CREATE POLICY "Permitir lectura propia"
ON public.profiles
FOR SELECT
USING (auth.uid() = id);

-- 4. Security Backfill
DO $$
DECLARE
    admin_id uuid;
    parent_id uuid;
BEGIN
    -- Fix for Admin User
    SELECT id INTO admin_id FROM auth.users WHERE email = 'erickgonzalezmatarrita@hotmail.com';

    IF admin_id IS NOT NULL THEN
        INSERT INTO public.profiles (id, role)
        VALUES (admin_id, 'admin')
        ON CONFLICT (id)
        DO UPDATE SET role = 'admin';

        RAISE NOTICE 'Admin profile fixed for erickgonzalezmatarrita@hotmail.com';
    ELSE
        RAISE NOTICE 'Admin user erickgonzalezmatarrita@hotmail.com not found in auth.users';
    END IF;

    -- Fix for Parent User
    SELECT id INTO parent_id FROM auth.users WHERE email = 'panelpadres@hotmail.com';

    IF parent_id IS NOT NULL THEN
        INSERT INTO public.profiles (id, role)
        VALUES (parent_id, 'parent')
        ON CONFLICT (id)
        DO UPDATE SET role = 'parent';

        RAISE NOTICE 'Parent profile fixed for panelpadres@hotmail.com';
    ELSE
        RAISE NOTICE 'Parent user panelpadres@hotmail.com not found in auth.users';
    END IF;
END $$;
