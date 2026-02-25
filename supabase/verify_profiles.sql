-- Verify Profiles and RLS Configuration
-- Run this script in the Supabase SQL Editor to diagnose profile synchronization issues.

DO $$
DECLARE
    v_admin_email TEXT := 'erickgonzalezmatarrita@hotmail.com';
    v_parent_email TEXT := 'panelpadres@hotmail.com';
    v_admin_id UUID;
    v_parent_id UUID;
    v_count INT;
BEGIN
    RAISE NOTICE '----------------------------------------------------------------';
    RAISE NOTICE 'Starting Profile Verification Process';
    RAISE NOTICE '----------------------------------------------------------------';

    -- 1. Verify Auth Users
    RAISE NOTICE 'Checking auth.users...';

    SELECT id INTO v_admin_id FROM auth.users WHERE email = v_admin_email;
    IF v_admin_id IS NOT NULL THEN
        RAISE NOTICE 'OK: Admin user found in auth.users (ID: %)', v_admin_id;
    ELSE
        RAISE WARNING 'FAIL: Admin user (%) NOT found in auth.users', v_admin_email;
    END IF;

    SELECT id INTO v_parent_id FROM auth.users WHERE email = v_parent_email;
    IF v_parent_id IS NOT NULL THEN
        RAISE NOTICE 'OK: Parent user found in auth.users (ID: %)', v_parent_id;
    ELSE
        RAISE WARNING 'FAIL: Parent user (%) NOT found in auth.users', v_parent_email;
    END IF;

    RAISE NOTICE '----------------------------------------------------------------';

    -- 2. Verify Public Profiles
    RAISE NOTICE 'Checking public.profiles...';

    IF v_admin_id IS NOT NULL THEN
        SELECT COUNT(*) INTO v_count FROM public.profiles WHERE id = v_admin_id;
        IF v_count > 0 THEN
            RAISE NOTICE 'OK: Admin profile found in public.profiles';
            -- Check Role
            SELECT COUNT(*) INTO v_count FROM public.profiles WHERE id = v_admin_id AND role = 'admin';
            IF v_count > 0 THEN
                RAISE NOTICE 'OK: Admin profile has correct role (admin)';
            ELSE
                RAISE WARNING 'FAIL: Admin profile has INCORRECT role (expected admin)';
            END IF;
        ELSE
            RAISE WARNING 'FAIL: Admin profile NOT found in public.profiles (ID: %)', v_admin_id;
        END IF;
    END IF;

    IF v_parent_id IS NOT NULL THEN
        SELECT COUNT(*) INTO v_count FROM public.profiles WHERE id = v_parent_id;
        IF v_count > 0 THEN
            RAISE NOTICE 'OK: Parent profile found in public.profiles';
             -- Check Role
            SELECT COUNT(*) INTO v_count FROM public.profiles WHERE id = v_parent_id AND role = 'parent';
            IF v_count > 0 THEN
                 RAISE NOTICE 'OK: Parent profile has correct role (parent)';
            ELSE
                RAISE WARNING 'FAIL: Parent profile has INCORRECT role (expected parent)';
            END IF;
        ELSE
            RAISE WARNING 'FAIL: Parent profile NOT found in public.profiles (ID: %)', v_parent_id;
        END IF;
    END IF;

    RAISE NOTICE '----------------------------------------------------------------';

    -- 3. Verify RLS Policies
    RAISE NOTICE 'Checking RLS Policies on public.profiles...';

    -- Check if RLS is enabled
    IF EXISTS (
        SELECT 1
        FROM pg_class c
        JOIN pg_namespace n ON n.oid = c.relnamespace
        WHERE n.nspname = 'public' AND c.relname = 'profiles' AND c.relrowsecurity = true
    ) THEN
        RAISE NOTICE 'OK: RLS is ENABLED on public.profiles';
    ELSE
        RAISE WARNING 'FAIL: RLS is DISABLED on public.profiles';
    END IF;

    -- List policies
    RAISE NOTICE 'Listing active policies for public.profiles:';
    FOR v_count IN
        SELECT count(*)
        FROM pg_policies
        WHERE schemaname = 'public' AND tablename = 'profiles'
    LOOP
        -- This loop runs once, v_count is just a placeholder
    END LOOP;

    -- We can't easily execute the policy logic here directly as a different user without SET ROLE,
    -- but we can inspect pg_policies.

    DECLARE
        policy_rec RECORD;
    BEGIN
        FOR policy_rec IN
            SELECT policyname, cmd, qual, with_check
            FROM pg_policies
            WHERE schemaname = 'public' AND tablename = 'profiles'
        LOOP
            RAISE NOTICE 'Policy: % | Command: % | Using: % | With Check: %',
                policy_rec.policyname, policy_rec.cmd, policy_rec.qual, policy_rec.with_check;

            -- Basic heuristic check for standard policy
            IF policy_rec.qual::text LIKE '%auth.uid() = id%' OR policy_rec.qual::text LIKE '%id = auth.uid()%' THEN
                 RAISE NOTICE '  -> Looks like a standard "Users can see their own profile" policy.';
            END IF;
        END LOOP;
    END;

    RAISE NOTICE '----------------------------------------------------------------';
    RAISE NOTICE 'Verification Complete.';
END $$;
