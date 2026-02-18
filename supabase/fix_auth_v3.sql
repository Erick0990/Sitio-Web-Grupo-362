-- Comprehensive Authentication Fix (Trigger, Backfill, RLS)

-- 1. Function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Check if the new user's email matches the admin email
  IF new.email = 'erickgonzalezmatarrita@hotmail.com' THEN
    INSERT INTO public.profiles (id, role, email, updated_at)
    VALUES (new.id, 'admin', new.email, NOW())
    ON CONFLICT (id) DO UPDATE
    SET role = 'admin', email = EXCLUDED.email, updated_at = NOW();
  ELSE
    INSERT INTO public.profiles (id, role, email, updated_at)
    VALUES (new.id, 'parent', new.email, NOW())
    ON CONFLICT (id) DO NOTHING;
  END IF;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Trigger the function every time a user is created
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 3. Backfill missing profiles for existing users
INSERT INTO public.profiles (id, role, email, updated_at)
SELECT id, 'parent', email, NOW()
FROM auth.users
WHERE id NOT IN (SELECT id FROM public.profiles)
ON CONFLICT (id) DO NOTHING;

-- 4. Update specific roles
UPDATE public.profiles
SET role = 'admin'
WHERE email = 'erickgonzalezmatarrita@hotmail.com';

-- 5. RLS Policies
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Drop potentially conflicting policies
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can do everything" ON public.profiles;
DROP POLICY IF EXISTS "Public profiles are viewable by everyone." ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile." ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile." ON public.profiles;

-- Create robust policies
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING ( auth.uid() = id );

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING ( auth.uid() = id );

CREATE POLICY "Admins can do everything"
  ON public.profiles
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Ensure users can insert their own profile if the trigger fails (fallback)
CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK ( auth.uid() = id );
