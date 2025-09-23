-- Purpose: Add explicit RLS policies for audited tables lacking policies
-- Tables covered (if they exist): articles_sitemap, job_listings, newsletters, lm_arena_* (leaderboard snapshots)
-- Access model:
--  - articles_sitemap: public SELECT, admin/service writes
--  - job_listings: public SELECT (read-only site section), admin/service writes
--  - newsletters: authenticated SELECT (contains user emails/content), admin/service writes
--  - lm_arena_%: public SELECT (leaderboards), admin/service writes

SET search_path = public, pg_temp;

-- Helper predicate for service role (from JWT)
CREATE OR REPLACE FUNCTION public.is_service_role()
RETURNS boolean
LANGUAGE sql
SECURITY INVOKER
SET search_path = public, pg_temp
AS $$
  SELECT coalesce((NULLIF(current_setting('request.jwt.claims', true), ''))::jsonb->>'role','') = 'service_role';
$$;

-- ARTICLES_SITEMAP
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='articles_sitemap') THEN
    -- Ensure RLS
    EXECUTE 'ALTER TABLE public.articles_sitemap ENABLE ROW LEVEL SECURITY';

    -- Reset existing policies to avoid duplicates
    FOR r IN (
      SELECT polname FROM pg_policy WHERE polrelid = 'public.articles_sitemap'::regclass
    ) LOOP
      EXECUTE format('DROP POLICY %I ON public.articles_sitemap', r.polname);
    END LOOP;

    -- Public read
    EXECUTE 'CREATE POLICY "Public can read articles_sitemap" ON public.articles_sitemap FOR SELECT USING (true)';
    -- Admin/service writes
    EXECUTE 'CREATE POLICY "Admins can write articles_sitemap" ON public.articles_sitemap FOR INSERT WITH CHECK (public.is_admin() OR public.is_service_role())';
    EXECUTE 'CREATE POLICY "Admins can update articles_sitemap" ON public.articles_sitemap FOR UPDATE USING (public.is_admin() OR public.is_service_role()) WITH CHECK (public.is_admin() OR public.is_service_role())';
    EXECUTE 'CREATE POLICY "Admins can delete articles_sitemap" ON public.articles_sitemap FOR DELETE USING (public.is_admin() OR public.is_service_role())';
  END IF;
END $$;

-- JOB_LISTINGS
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='job_listings') THEN
    EXECUTE 'ALTER TABLE public.job_listings ENABLE ROW LEVEL SECURITY';
    FOR r IN (
      SELECT polname FROM pg_policy WHERE polrelid = 'public.job_listings'::regclass
    ) LOOP
      EXECUTE format('DROP POLICY %I ON public.job_listings', r.polname);
    END LOOP;
    -- Public read (site section is public-facing)
    EXECUTE 'CREATE POLICY "Public can read job_listings" ON public.job_listings FOR SELECT USING (true)';
    -- Admin/service writes
    EXECUTE 'CREATE POLICY "Admins can write job_listings" ON public.job_listings FOR INSERT WITH CHECK (public.is_admin() OR public.is_service_role())';
    EXECUTE 'CREATE POLICY "Admins can update job_listings" ON public.job_listings FOR UPDATE USING (public.is_admin() OR public.is_service_role()) WITH CHECK (public.is_admin() OR public.is_service_role())';
    EXECUTE 'CREATE POLICY "Admins can delete job_listings" ON public.job_listings FOR DELETE USING (public.is_admin() OR public.is_service_role())';
  END IF;
END $$;

-- NEWSLETTERS
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='newsletters') THEN
    EXECUTE 'ALTER TABLE public.newsletters ENABLE ROW LEVEL SECURITY';
    FOR r IN (
      SELECT polname FROM pg_policy WHERE polrelid = 'public.newsletters'::regclass
    ) LOOP
      EXECUTE format('DROP POLICY %I ON public.newsletters', r.polname);
    END LOOP;
    -- Authenticated read only (might include content; avoid scraping)
    EXECUTE 'CREATE POLICY "Authenticated can read newsletters" ON public.newsletters FOR SELECT USING (auth.uid() IS NOT NULL)';
    -- Admin/service writes
    EXECUTE 'CREATE POLICY "Admins can write newsletters" ON public.newsletters FOR INSERT WITH CHECK (public.is_admin() OR public.is_service_role())';
    EXECUTE 'CREATE POLICY "Admins can update newsletters" ON public.newsletters FOR UPDATE USING (public.is_admin() OR public.is_service_role()) WITH CHECK (public.is_admin() OR public.is_service_role())';
    EXECUTE 'CREATE POLICY "Admins can delete newsletters" ON public.newsletters FOR DELETE USING (public.is_admin() OR public.is_service_role())';
  END IF;
END $$;

-- LM_ARENA_* (only for known leaderboard table used by app; avoid wildcard unknowns)
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='lm_arena_leaderboard_snapshots') THEN
    EXECUTE 'ALTER TABLE public.lm_arena_leaderboard_snapshots ENABLE ROW LEVEL SECURITY';
    FOR r IN (
      SELECT polname FROM pg_policy WHERE polrelid = 'public.lm_arena_leaderboard_snapshots'::regclass
    ) LOOP
      EXECUTE format('DROP POLICY %I ON public.lm_arena_leaderboard_snapshots', r.polname);
    END LOOP;
    -- Public read (leaderboard)
    EXECUTE 'CREATE POLICY "Public can read lm_arena leaderboard" ON public.lm_arena_leaderboard_snapshots FOR SELECT USING (true)';
    -- Admin/service writes
    EXECUTE 'CREATE POLICY "Admins can write lm_arena leaderboard" ON public.lm_arena_leaderboard_snapshots FOR INSERT WITH CHECK (public.is_admin() OR public.is_service_role())';
    EXECUTE 'CREATE POLICY "Admins can update lm_arena leaderboard" ON public.lm_arena_leaderboard_snapshots FOR UPDATE USING (public.is_admin() OR public.is_service_role()) WITH CHECK (public.is_admin() OR public.is_service_role())';
    EXECUTE 'CREATE POLICY "Admins can delete lm_arena leaderboard" ON public.lm_arena_leaderboard_snapshots FOR DELETE USING (public.is_admin() OR public.is_service_role())';
  END IF;
END $$;

-- Acceptance tests (run per existing table):
-- Anonymous:
--  select set_config('request.jwt.claims', NULL, true);
--  select * from public.articles_sitemap limit 1;   -- EXPECT: rows (if table exists)
--  select * from public.job_listings limit 1;        -- EXPECT: rows (if table exists)
--  select * from public.newsletters limit 1;         -- EXPECT: ERROR (auth-only)
--  select * from public.lm_arena_leaderboard_snapshots limit 1; -- EXPECT: rows (if table exists)
-- Authenticated (non-admin):
--  select set_config('request.jwt.claims', '{"sub":"<user_uuid>","role":"authenticated"}', true);
--  inserts/updates/deletes should fail; selects behave as above
-- Admin:
--  select set_config('request.jwt.claims', '{"sub":"<admin_uuid>","role":"authenticated"}', true);
--  ensure profiles.role='admin' for admin_uuid; writes should succeed on all covered tables


