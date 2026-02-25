-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. UPDATE PROFILES TABLE
-- Add status column if it doesn't exist. Default is 'pending' for new users.
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'status') THEN
        ALTER TABLE public.profiles ADD COLUMN status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved'));
        -- Auto-approve existing users to prevent lockout
        UPDATE public.profiles SET status = 'approved' WHERE status IS NULL OR status = 'pending';
    END IF;
END $$;

-- 2. SCOUTS TABLE (Protagonistas)
CREATE TABLE IF NOT EXISTS public.scouts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    parent_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    date_of_birth DATE,
    section TEXT CHECK (section IN ('manada', 'tropa')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. ATTENDANCE TABLE (Asistencia)
CREATE TABLE IF NOT EXISTS public.attendance (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    scout_id UUID REFERENCES public.scouts(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    is_present BOOLEAN DEFAULT false,
    recorded_by UUID REFERENCES public.profiles(id), -- Admin who recorded it
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. PROGRESS TABLE (Progresiones)
CREATE TABLE IF NOT EXISTS public.progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    scout_id UUID REFERENCES public.scouts(id) ON DELETE CASCADE,
    type TEXT CHECK (type IN ('etapa', 'especialidad')),
    name TEXT NOT NULL, -- "Pata tierna", "Cocina", etc.
    percentage INTEGER DEFAULT 0 CHECK (percentage IN (0, 25, 50, 75, 100)),
    last_updated_by UUID REFERENCES public.profiles(id),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. ANNOUNCEMENTS & ACTIVITIES
CREATE TABLE IF NOT EXISTS public.announcements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    author_id UUID REFERENCES public.profiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    is_active BOOLEAN DEFAULT true
);

CREATE TABLE IF NOT EXISTS public.activities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT,
    date TIMESTAMP WITH TIME ZONE NOT NULL,
    location TEXT,
    created_by UUID REFERENCES public.profiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. GROUP FINANCE (Single Row Table)
CREATE TABLE IF NOT EXISTS public.group_finance (
    id INTEGER PRIMARY KEY DEFAULT 1 CHECK (id = 1), -- Ensure only one row
    balance DECIMAL(10, 2) DEFAULT 0.00,
    last_updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_by UUID REFERENCES public.profiles(id)
);

-- Insert initial row if not exists
INSERT INTO public.group_finance (id, balance)
VALUES (1, 0.00)
ON CONFLICT (id) DO NOTHING;


-- 7. RLS POLICIES

-- Enable RLS on all new tables
ALTER TABLE public.scouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_finance ENABLE ROW LEVEL SECURITY;

-- Helper function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- SCOUTS POLICIES
-- Admins: Full Access
CREATE POLICY "Admins can do everything on scouts" ON public.scouts
    FOR ALL USING (public.is_admin());

-- Parents: Read their own children
CREATE POLICY "Parents can view their own scouts" ON public.scouts
    FOR SELECT USING (auth.uid() = parent_id);

-- Parents: Create their own children
CREATE POLICY "Parents can create their own scouts" ON public.scouts
    FOR INSERT WITH CHECK (auth.uid() = parent_id);

-- Parents: Update their own children
CREATE POLICY "Parents can update their own scouts" ON public.scouts
    FOR UPDATE USING (auth.uid() = parent_id);

-- Parents: Delete their own children
CREATE POLICY "Parents can delete their own scouts" ON public.scouts
    FOR DELETE USING (auth.uid() = parent_id);

-- ATTENDANCE POLICIES
-- Admins: Full Access
CREATE POLICY "Admins can do everything on attendance" ON public.attendance
    FOR ALL USING (public.is_admin());

-- Parents: Read only for their children
CREATE POLICY "Parents can view attendance for their scouts" ON public.attendance
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM public.scouts WHERE id = attendance.scout_id AND parent_id = auth.uid())
    );

-- PROGRESS POLICIES
-- Admins: Full Access
CREATE POLICY "Admins can do everything on progress" ON public.progress
    FOR ALL USING (public.is_admin());

-- Parents: Read only for their children
CREATE POLICY "Parents can view progress for their scouts" ON public.progress
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM public.scouts WHERE id = progress.scout_id AND parent_id = auth.uid())
    );

-- ANNOUNCEMENTS POLICIES
-- Admins: Full Access
CREATE POLICY "Admins can do everything on announcements" ON public.announcements
    FOR ALL USING (public.is_admin());

-- Everyone (Authenticated): Read active announcements
CREATE POLICY "Everyone can view active announcements" ON public.announcements
    FOR SELECT USING (true); -- Or (is_active = true) if you want to hide inactive ones from history

-- ACTIVITIES POLICIES
-- Admins: Full Access
CREATE POLICY "Admins can do everything on activities" ON public.activities
    FOR ALL USING (public.is_admin());

-- Everyone (Authenticated): Read activities
CREATE POLICY "Everyone can view activities" ON public.activities
    FOR SELECT USING (true);

-- FINANCE POLICIES
-- Admins: Full Access
CREATE POLICY "Admins can do everything on finance" ON public.group_finance
    FOR ALL USING (public.is_admin());

-- Parents: No access (or Read Only if transparency is desired? "Cualquier administrador puede ver y editar". implies parents might not see it. Assume hidden for parents for now based on context "Junta de Grupo" module).
-- If transparency is needed later, add a SELECT policy for authenticated users.


-- Ensure profiles policies allow reading/updating status for Admins
-- (Assuming existing profiles policies might need adjustment)
-- We add a policy for Admins to update any profile (to approve parents)

CREATE POLICY "Admins can update any profile" ON public.profiles
    FOR UPDATE USING (public.is_admin());

-- Grant usage on schemas if needed (usually public is fine)
GRANT USAGE ON SCHEMA public TO postgres, anon, authenticated, service_role;
