-- Fix Authentication and RLS Policies

-- 1. Ensure RLS is enabled (safe to run if already enabled)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 2. Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Public profiles are viewable by everyone." ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile." ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile." ON public.profiles;
DROP POLICY IF EXISTS "Profiles are viewable by users and admins" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can do everything" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;

-- 3. Policy: Users can view their own profile
-- This allows any authenticated user to read their own row (including role).
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING ( auth.uid() = id );

-- 4. Policy: Admins can do everything (SELECT, INSERT, UPDATE, DELETE)
-- This allows admins to manage all profiles.
-- The subquery checks if the current user is an admin.
-- Since "Users can view own profile" exists, the subquery should succeed for the admin's own row.
CREATE POLICY "Admins can do everything"
  ON public.profiles
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- 5. Policy: Users can update their own profile (e.g. name, email)
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING ( auth.uid() = id );

-- 6. Policy: Users can insert their own profile (if needed manually)
CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK ( auth.uid() = id );

-- 7. Ensure specific users have correct roles
-- Update erickgonzalezmatarrita@hotmail.com to admin
UPDATE public.profiles
SET role = 'admin'
WHERE id IN (SELECT id FROM auth.users WHERE email = 'erickgonzalezmatarrita@hotmail.com');

-- Update panelpadres@hotmail.com to parent
UPDATE public.profiles
SET role = 'parent'
WHERE id IN (SELECT id FROM auth.users WHERE email = 'panelpadres@hotmail.com');

-- 8. Final Security Check: Ensure RLS is enabled
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
