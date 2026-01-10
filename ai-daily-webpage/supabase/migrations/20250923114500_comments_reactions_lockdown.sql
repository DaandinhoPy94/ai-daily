-- Purpose: Lock down comments and reactions visibility; enforce ownership and admin moderation
-- Defaults to authenticated-only reads; flip to published-only anonymous by enabling commented policy blocks

SET search_path = public, pg_temp;

-- COMMENTS: tighten SELECT and ensure ownership + admin moderation
DO $$ BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname='public' AND tablename='article_comments' AND policyname='Anyone can read comments on published articles'
  ) THEN
    DROP POLICY "Anyone can read comments on published articles" ON public.article_comments;
  END IF;
END $$;

-- Authenticated-only read of comments
CREATE POLICY "Authenticated users can read comments"
ON public.article_comments
FOR SELECT
USING (auth.uid() IS NOT NULL);

-- Optional: allow anonymous reads but only for published articles (commented by default)
-- CREATE POLICY "Anyone can read comments on published articles"
-- ON public.article_comments
-- FOR SELECT
-- USING (
--   EXISTS (
--     SELECT 1 FROM public.articles a
--     WHERE a.id = article_comments.article_id 
--     AND a.status = 'published' 
--     AND a.published_at <= now()
--   )
-- );

-- Ensure ownership policies exist (idempotent: drop if present then recreate)
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='article_comments' AND policyname='Authenticated users can create comments') THEN
    DROP POLICY "Authenticated users can create comments" ON public.article_comments;
  END IF;
END $$;

CREATE POLICY "Authenticated users can create comments" 
ON public.article_comments 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='article_comments' AND policyname='Users can update their own comments') THEN
    DROP POLICY "Users can update their own comments" ON public.article_comments;
  END IF;
END $$;

CREATE POLICY "Users can update their own comments" 
ON public.article_comments 
FOR UPDATE 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='article_comments' AND policyname='Users can delete their own comments') THEN
    DROP POLICY "Users can delete their own comments" ON public.article_comments;
  END IF;
END $$;

CREATE POLICY "Users can delete their own comments" 
ON public.article_comments 
FOR DELETE 
USING (auth.uid() = user_id);

-- Admin moderation: admins can manage all comments
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='article_comments' AND policyname='Admins can manage all comments') THEN
    DROP POLICY "Admins can manage all comments" ON public.article_comments;
  END IF;
END $$;

CREATE POLICY "Admins can manage all comments"
ON public.article_comments
FOR ALL
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- REACTIONS: tighten SELECT and ensure ownership + admin moderation
DO $$ BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname='public' AND tablename='comment_reactions' AND policyname='Anyone can read reactions'
  ) THEN
    DROP POLICY "Anyone can read reactions" ON public.comment_reactions;
  END IF;
END $$;

-- Authenticated-only read of reactions
CREATE POLICY "Authenticated users can read reactions"
ON public.comment_reactions
FOR SELECT
USING (auth.uid() IS NOT NULL);

-- Ownership management for reactions
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='comment_reactions' AND policyname='Authenticated users can manage their reactions') THEN
    DROP POLICY "Authenticated users can manage their reactions" ON public.comment_reactions;
  END IF;
END $$;

CREATE POLICY "Authenticated users can manage their reactions" 
ON public.comment_reactions 
FOR ALL 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Admin moderation for reactions
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='comment_reactions' AND policyname='Admins can manage all reactions') THEN
    DROP POLICY "Admins can manage all reactions" ON public.comment_reactions;
  END IF;
END $$;

CREATE POLICY "Admins can manage all reactions"
ON public.comment_reactions
FOR ALL
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- Acceptance tests (run manually):
-- Anonymous (no JWT):
--   select set_config('request.jwt.claims', NULL, true);
--   select * from public.article_comments limit 1; -- EXPECT: ERROR (auth-only default)
--   select * from public.comment_reactions limit 1; -- EXPECT: ERROR (auth-only)
-- Authenticated:
--   select set_config('request.jwt.claims', '{"sub":"<user_uuid>","role":"authenticated"}', true);
--   select * from public.article_comments where article_id in (select id from public.articles where status='published') limit 1; -- EXPECT: rows
-- Ownership:
--   insert/update/delete on own rows succeed; on others fail
-- Admin moderation:
--   select set_config('request.jwt.claims', '{"sub":"<admin_uuid>","role":"authenticated"}', true);
--   -- ensure admin has profiles.role='admin'; then admin can update/delete any comment/reaction


