-- Purpose: Clean up duplicate/conflicting policies for clarity and least privilege
-- Tables: profiles, article_comments, comment_reactions

SET search_path = public, pg_temp;

-- ===== profiles =====
-- Intent:
--  - SELECT: authenticated users can read profiles
--  - INSERT: users can insert their own profile
--  - UPDATE: users can update their own profile (role change blocked by trigger); admins can update any
--  - DELETE: no one except admins (rarely used)
DO $$ BEGIN
  -- Drop all existing policies to avoid overlap, then recreate minimal set
  FOR r IN (
    SELECT polname FROM pg_policy WHERE polrelid = 'public.profiles'::regclass
  ) LOOP
    EXECUTE format('DROP POLICY %I ON public.profiles', r.polname);
  END LOOP;
END $$;

-- SELECT (auth-only)
CREATE POLICY "profiles_select_authenticated"
ON public.profiles
FOR SELECT
USING (auth.uid() IS NOT NULL);

-- INSERT (self only)
CREATE POLICY "profiles_insert_self"
ON public.profiles
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- UPDATE (self or admin; role change gated by trigger)
CREATE POLICY "profiles_update_self_or_admin"
ON public.profiles
FOR UPDATE
USING (auth.uid() = user_id OR public.is_admin())
WITH CHECK (auth.uid() = user_id OR public.is_admin());

-- DELETE (admin only)
CREATE POLICY "profiles_delete_admin"
ON public.profiles
FOR DELETE
USING (public.is_admin());

-- Acceptance:
--  - pg_policies shows exactly 4 policies on profiles named profiles_* per action
--  - Non-admin cannot change role due to trigger; admin can

-- ===== article_comments =====
-- Intent:
--  - SELECT: authenticated-only (prefer privacy); optionally add published-only anon policy later
--  - INSERT/UPDATE/DELETE: owners; admins can moderate all
DO $$ BEGIN
  FOR r IN (
    SELECT polname FROM pg_policy WHERE polrelid = 'public.article_comments'::regclass
  ) LOOP
    EXECUTE format('DROP POLICY %I ON public.article_comments', r.polname);
  END LOOP;
END $$;

CREATE POLICY "article_comments_select_authenticated"
ON public.article_comments
FOR SELECT
USING (auth.uid() IS NOT NULL);

CREATE POLICY "article_comments_insert_owner"
ON public.article_comments
FOR INSERT
WITH CHECK (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "article_comments_update_owner_or_admin"
ON public.article_comments
FOR UPDATE
USING (auth.uid() = user_id OR public.is_admin())
WITH CHECK (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "article_comments_delete_owner_or_admin"
ON public.article_comments
FOR DELETE
USING (auth.uid() = user_id OR public.is_admin());

-- Acceptance: four clear policies; anon SELECT denied by default

-- ===== comment_reactions =====
-- Intent:
--  - SELECT: authenticated-only (privacy)
--  - ALL writes: owner; admins can moderate all
DO $$ BEGIN
  FOR r IN (
    SELECT polname FROM pg_policy WHERE polrelid = 'public.comment_reactions'::regclass
  ) LOOP
    EXECUTE format('DROP POLICY %I ON public.comment_reactions', r.polname);
  END LOOP;
END $$;

CREATE POLICY "comment_reactions_select_authenticated"
ON public.comment_reactions
FOR SELECT
USING (auth.uid() IS NOT NULL);

CREATE POLICY "comment_reactions_write_owner_or_admin"
ON public.comment_reactions
FOR ALL
USING (auth.uid() = user_id OR public.is_admin())
WITH CHECK (auth.uid() = user_id OR public.is_admin());

-- Acceptance: two clear policies; auth-only reads; owner/admin writes


