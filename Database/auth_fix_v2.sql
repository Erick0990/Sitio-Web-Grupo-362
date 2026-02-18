-- Fix Authentication, Profiles, and RLS - Version 2

-- 1. Ensure public.profiles Table Exists and has full_name column
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  role text default 'parent',
  email text,
  updated_at timestamp with time zone,
  constraint role_check check (role in ('admin', 'parent'))
);

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'full_name') THEN
        ALTER TABLE public.profiles ADD COLUMN full_name text;
    END IF;
END $$;

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 2. Create Function to Handle New User Profile Creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
DECLARE
  profile_name text;
BEGIN
  -- Extract name from metadata or fallback to email prefix
  profile_name := COALESCE(
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'name',
    split_part(new.email, '@', 1)
  );

  INSERT INTO public.profiles (id, role, email, full_name, updated_at)
  VALUES (
    new.id,
    CASE
      WHEN new.email = 'erickgonzalezmatarrita@hotmail.com' THEN 'admin'
      ELSE 'parent'
    END,
    new.email,
    profile_name,
    NOW()
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Create Trigger on auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 4. Drop Existing Policies to Start Fresh
DROP POLICY IF EXISTS "Public profiles are viewable by everyone." ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile." ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile." ON public.profiles;
DROP POLICY IF EXISTS "Profiles are viewable by users and admins" ON public.profiles;

-- 5. Create Correct RLS Policies

-- Policy: Users can view their own profile OR Admins can view ALL profiles
CREATE POLICY "Profiles are viewable by users and admins"
  ON public.profiles FOR SELECT
  USING (
    (auth.uid() = id)
    OR
    (EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    ))
  );

-- Policy: Users can update their own profile
CREATE POLICY "Users can update own profile."
  ON public.profiles FOR UPDATE
  USING ( auth.uid() = id );

-- Policy: Users can insert their own profile (Required for manual inserts, trigger bypasses this)
CREATE POLICY "Users can insert their own profile."
  ON public.profiles FOR INSERT
  WITH CHECK ( auth.uid() = id );

-- 6. Backfill Missing Profiles (CRITICAL FIX)
-- Inserts profiles for existing users in auth.users that do not have a corresponding entry in public.profiles
INSERT INTO public.profiles (id, email, role, full_name, updated_at)
SELECT
  id,
  email,
  CASE
    WHEN email = 'erickgonzalezmatarrita@hotmail.com' THEN 'admin'
    ELSE 'parent'
  END,
  COALESCE(
    raw_user_meta_data->>'full_name',
    raw_user_meta_data->>'name',
    split_part(email, '@', 1)
  ),
  NOW()
FROM auth.users
WHERE id NOT IN (SELECT id FROM public.profiles);
