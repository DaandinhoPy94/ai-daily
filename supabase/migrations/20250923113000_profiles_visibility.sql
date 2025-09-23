-- Purpose: Restrict profile visibility; move any public reads to a limited view
-- Changes:
--  - Drop broad public read policy on profiles
--  - Enforce authenticated-only SELECT on profiles
--  - Create public_profiles view with whitelisted fields
--  - Provide acceptance test snippets in comments

SET search_path = public, pg_temp;

-- Remove any existing public-read policy
DO $$ BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname='public' AND tablename='profiles' AND policyname='Public can read profile display info'
  ) THEN
    DROP POLICY "Public can read profile display info" ON public.profiles;
  END IF;
END $$;

-- Replace/ensure SELECT policy: authenticated users only
DO $$ BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname='public' AND tablename='profiles' AND policyname='Users can read own profile'
  ) THEN
    DROP POLICY "Users can read own profile" ON public.profiles;
  END IF;
END $$;

CREATE POLICY "Authenticated users can read profiles"
ON public.profiles
FOR SELECT
USING (auth.uid() IS NOT NULL);

-- Optional public-facing view with limited fields
CREATE OR REPLACE VIEW public.public_profiles AS
SELECT 
  p.user_id,
  p.display_name,
  p.avatar_url
FROM public.profiles p;

-- RLS on views is enforced via base table policies. If we want anonymous access to the view,
-- create a dedicated policy on the base table limited to the columns in the view using USING(true)
-- and rely on the view to limit columns. By default, keep it authenticated-only by reusing the base policy.

-- If anonymous read is desired, uncomment the policy below:
-- CREATE POLICY "Anonymous can read profiles via view"
-- ON public.profiles
-- FOR SELECT
-- USING (true);

-- Acceptance tests (run manually):
-- 1) Anonymous SELECT from profiles (should be denied)
--    select set_config('request.jwt.claims', NULL, true);
--    select * from public.profiles limit 1; -- EXPECT: ERROR (no policy allows)
--
-- 2) Anonymous SELECT from public_profiles
--    -- Default: also denied, since base table requires auth
--    select set_config('request.jwt.claims', NULL, true);
--    select * from public.public_profiles limit 1; -- EXPECT: ERROR (unless anonymous policy enabled above)
--
-- 3) Authenticated user can read profiles
--    select set_config('request.jwt.claims', '{"sub":"<any_user_uuid>","role":"authenticated"}', true);
--    select user_id, display_name from public.profiles limit 1; -- EXPECT: rows


