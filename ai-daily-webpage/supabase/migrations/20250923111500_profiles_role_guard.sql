-- Purpose: Prevent profile role escalation and split update policies
-- Context: Adds is_admin(), BEFORE UPDATE trigger blocking role changes for non-admins, and admin update policy
-- Safety: Functions set explicit search_path and use SECURITY INVOKER

-- Optional: ensure we resolve objects in public schema deterministically
SET search_path = public, pg_temp;

-- Create or replace helper to check admin privilege based on profiles.role
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY INVOKER
SET search_path = public, pg_temp
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.profiles p
    WHERE p.user_id = auth.uid()
      AND p.role = 'admin'::public.user_role
  );
$$;

-- Trigger function: block role changes unless admin or service role
CREATE OR REPLACE FUNCTION public.profiles_block_role_change()
RETURNS trigger
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public, pg_temp
AS $$
DECLARE
  jwt_claims text := current_setting('request.jwt.claims', true);
  jwt jsonb := NULLIF(jwt_claims, '')::jsonb;
  is_service boolean := coalesce(jwt->>'role','') = 'service_role';
BEGIN
  IF TG_OP = 'UPDATE' AND NEW.role IS DISTINCT FROM OLD.role THEN
    IF is_service OR public.is_admin() THEN
      RETURN NEW;
    ELSE
      RAISE EXCEPTION 'Changing role is not permitted for non-admin users';
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

-- Attach BEFORE UPDATE trigger to profiles
DROP TRIGGER IF EXISTS profiles_block_role_change ON public.profiles;
CREATE TRIGGER profiles_block_role_change
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.profiles_block_role_change();

-- RLS: replace self-update policy and add admin-wide update policy
DO $$ BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname='public' AND tablename='profiles' AND policyname='Users can update own profile'
  ) THEN
    DROP POLICY "Users can update own profile" ON public.profiles;
  END IF;
  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname='public' AND tablename='profiles' AND policyname='Users can update own profile (no role change)'
  ) THEN
    DROP POLICY "Users can update own profile (no role change)" ON public.profiles;
  END IF;
  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname='public' AND tablename='profiles' AND policyname='Admins can update any profile'
  ) THEN
    DROP POLICY "Admins can update any profile" ON public.profiles;
  END IF;
END $$;

-- Policy A: self-updates (role change blocked by trigger)
CREATE POLICY "Users can update own profile (no role change)"
ON public.profiles
FOR UPDATE
USING (auth.uid() = user_id);

-- Policy B: admins can update any profile (including role)
CREATE POLICY "Admins can update any profile"
ON public.profiles
FOR UPDATE
USING (public.is_admin());

-- Acceptance tests (run manually after migration):
-- 1) Non-admin tries to change their role (should fail)
--    set local role postgres; -- for psql superuser to set jwt below
--    select set_config('request.jwt.claims', '{"sub":"<non_admin_user_uuid>","role":"authenticated"}', true);
--    update public.profiles set role = 'admin' where user_id = '<non_admin_user_uuid>'::uuid; -- EXPECT: ERROR
--
-- 2) Admin changes another user’s role (should succeed)
--    select set_config('request.jwt.claims', '{"sub":"<admin_user_uuid>","role":"authenticated"}', true);
--    -- ensure <admin_user_uuid> has role='admin' in public.profiles first
--    update public.profiles set role = 'admin' where user_id = '<target_user_uuid>'::uuid; -- EXPECT: UPDATE 1
--
-- 3) Non-admin updates safe field (should succeed)
--    select set_config('request.jwt.claims', '{"sub":"<non_admin_user_uuid>","role":"authenticated"}', true);
--    update public.profiles set display_name = 'Nieuwe naam' where user_id = '<non_admin_user_uuid>'::uuid; -- EXPECT: UPDATE 1


