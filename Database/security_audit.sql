-- Security Hardening Script

-- 1. Hardening Profiles Table Policies
-- Drop existing permissive policy
DROP POLICY IF EXISTS "Public profiles are viewable by everyone." ON public.profiles;

-- Create restrictive policies
-- Users can view their own profile
CREATE POLICY "Users can view own profile"
ON public.profiles FOR SELECT
TO authenticated
USING ( auth.uid() = id );

-- Admins can view all profiles
CREATE POLICY "Admins can view all profiles"
ON public.profiles FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
);

-- 2. Prevent Role Escalation
-- Function to prevent role changes by non-admins
CREATE OR REPLACE FUNCTION public.check_role_update()
RETURNS TRIGGER AS $$
BEGIN
  -- If the role is being changed
  IF NEW.role IS DISTINCT FROM OLD.role THEN
    -- Check if the user performing the update is an admin
    IF NOT EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid()
      AND role = 'admin'
    ) THEN
      RAISE EXCEPTION 'Unauthorized: Only administrators can change user roles.';
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to enforce role protection
DROP TRIGGER IF EXISTS ensure_role_protection ON public.profiles;
CREATE TRIGGER ensure_role_protection
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE PROCEDURE public.check_role_update();

-- 3. Verify and Strengthen Anuncios Policies (if not already present or needs update)
-- Ensure 'anuncios' policies are strictly for authenticated users with checks.
-- (Existing policies in update_schema.sql seem correct, but we can re-assert if needed.
--  We assume they are applied. If not, this script can be extended.)
