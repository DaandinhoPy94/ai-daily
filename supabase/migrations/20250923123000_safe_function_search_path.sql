-- Purpose: Ensure all user-defined functions set a safe explicit search_path
-- We standardize on: SET search_path = public, pg_temp

SET search_path = public, pg_temp;

-- search_articles
CREATE OR REPLACE FUNCTION public.search_articles(
  q text,
  search_limit int DEFAULT 20,
  search_offset int DEFAULT 0
)
RETURNS TABLE(
  id uuid,
  slug text,
  title text,
  summary text,
  published_at timestamp with time zone,
  read_time_minutes integer,
  rank real,
  snippet text
)
LANGUAGE plpgsql
STABLE
SET search_path = public, pg_temp
AS $$
DECLARE
  search_query tsquery;
BEGIN
  IF q IS NULL OR trim(q) = '' THEN
    RETURN;
  END IF;
  BEGIN
    search_query := websearch_to_tsquery('simple', trim(q));
  EXCEPTION WHEN OTHERS THEN
    search_query := plainto_tsquery('simple', trim(q));
  END;
  IF search_query IS NULL THEN
    RETURN;
  END IF;
  RETURN QUERY
  SELECT 
    a.id,
    a.slug,
    a.title,
    a.summary,
    a.published_at,
    a.read_time_minutes,
    ts_rank_cd(a.tsv, search_query) as rank,
    CASE 
      WHEN a.summary IS NOT NULL AND length(trim(a.summary)) > 0 THEN
        ts_headline('simple', a.summary, search_query, 'MaxWords=50, MinWords=20, ShortWord=3, HighlightAll=false')
      ELSE
        ts_headline('simple', 
          regexp_replace(coalesce(a.body, ''), '<[^>]*>', '', 'g'), 
          search_query, 
          'MaxWords=50, MinWords=20, ShortWord=3, HighlightAll=false'
        )
    END as snippet
  FROM public.articles a
  WHERE 
    a.status = 'published'
    AND a.published_at <= now()
    AND a.tsv @@ search_query
  ORDER BY 
    ts_rank_cd(a.tsv, search_query) DESC,
    a.published_at DESC
  LIMIT search_limit
  OFFSET search_offset;
END;
$$;

-- enqueue_embedding_job
CREATE OR REPLACE FUNCTION public.enqueue_embedding_job(p_article_id uuid)
RETURNS void
LANGUAGE plpgsql
SET search_path = public, pg_temp
AS $$
BEGIN
  INSERT INTO public.embedding_jobs (article_id, status)
  VALUES (p_article_id, 'pending')
  ON CONFLICT (article_id, status) DO NOTHING;
END;
$$;

-- trg_articles_embedding
CREATE OR REPLACE FUNCTION public.trg_articles_embedding()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public, pg_temp
AS $$
BEGIN
  IF NEW.status IN ('published', 'scheduled') THEN
    IF TG_OP = 'INSERT' OR 
       OLD.title IS DISTINCT FROM NEW.title OR 
       OLD.summary IS DISTINCT FROM NEW.summary OR 
       OLD.body IS DISTINCT FROM NEW.body OR
       OLD.status IS DISTINCT FROM NEW.status THEN
      PERFORM public.enqueue_embedding_job(NEW.id);
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

-- hybrid_search
CREATE OR REPLACE FUNCTION public.hybrid_search(
  q text,
  search_limit int DEFAULT 20,
  search_offset int DEFAULT 0,
  semantic_weight real DEFAULT 0.5
)
RETURNS TABLE(
  id uuid,
  slug text,
  title text,
  summary text,
  published_at timestamp with time zone,
  read_time_minutes integer,
  fts_rank real,
  semantic_rank real,
  combined_rank real,
  search_type text,
  snippet text
)
LANGUAGE plpgsql
STABLE
SET search_path = public, pg_temp
AS $$
DECLARE
  search_query tsquery;
  has_embeddings boolean := false;
  embedding_count integer;
BEGIN
  IF q IS NULL OR trim(q) = '' THEN
    RETURN;
  END IF;
  SELECT COUNT(*) INTO embedding_count FROM public.article_embeddings LIMIT 1;
  has_embeddings := embedding_count > 0;
  BEGIN
    search_query := websearch_to_tsquery('simple', trim(q));
  EXCEPTION WHEN OTHERS THEN
    search_query := plainto_tsquery('simple', trim(q));
  END;
  IF search_query IS NULL THEN
    RETURN;
  END IF;
  IF has_embeddings THEN
    RETURN QUERY
    WITH fts_results AS (
      SELECT 
        a.id,
        a.slug,
        a.title,
        a.summary,
        a.published_at,
        a.read_time_minutes,
        ts_rank_cd(a.tsv, search_query) as rank,
        CASE 
          WHEN a.summary IS NOT NULL AND length(trim(a.summary)) > 0 THEN
            ts_headline('simple', a.summary, search_query, 'MaxWords=50, MinWords=20, ShortWord=3')
          ELSE
            ts_headline('simple', 
              regexp_replace(coalesce(a.body, ''), '<[^>]*>', '', 'g'), 
              search_query, 
              'MaxWords=50, MinWords=20, ShortWord=3'
            )
        END as snippet
      FROM public.articles a
      WHERE 
        a.status = 'published'
        AND a.published_at <= now()
        AND a.tsv @@ search_query
    ),
    semantic_results AS (
      SELECT 
        a.id,
        a.slug,
        a.title,
        a.summary,
        a.published_at,
        a.read_time_minutes,
        1.0 - (ae.embedding <=> '[0,0,0]'::vector) as rank,
        CASE 
          WHEN a.summary IS NOT NULL AND length(trim(a.summary)) > 0 THEN
            a.summary
          ELSE
            left(regexp_replace(coalesce(a.body, ''), '<[^>]*>', '', 'g'), 200) || '...'
        END as snippet
      FROM public.articles a
      JOIN public.article_embeddings ae ON a.id = ae.article_id
      WHERE 
        a.status = 'published'
        AND a.published_at <= now()
      ORDER BY ae.embedding <=> '[0,0,0]'::vector
      LIMIT search_limit * 2
    ),
    combined_results AS (
      SELECT DISTINCT
        COALESCE(f.id, s.id) as id,
        COALESCE(f.slug, s.slug) as slug,
        COALESCE(f.title, s.title) as title,
        COALESCE(f.summary, s.summary) as summary,
        COALESCE(f.published_at, s.published_at) as published_at,
        COALESCE(f.read_time_minutes, s.read_time_minutes) as read_time_minutes,
        COALESCE(f.rank, 0.0) as fts_rank,
        COALESCE(s.rank, 0.0) as semantic_rank,
        (COALESCE(f.rank, 0.0) * (1.0 - semantic_weight) + COALESCE(s.rank, 0.0) * semantic_weight) as combined_rank,
        CASE 
          WHEN f.id IS NOT NULL AND s.id IS NOT NULL THEN 'hybrid'
          WHEN s.id IS NOT NULL THEN 'semantic'
          ELSE 'text'
        END as search_type,
        COALESCE(f.snippet, s.snippet) as snippet
      FROM fts_results f
      FULL OUTER JOIN semantic_results s ON f.id = s.id
    )
    SELECT 
      r.id,
      r.slug,
      r.title,
      r.summary,
      r.published_at,
      r.read_time_minutes,
      r.fts_rank,
      r.semantic_rank,
      r.combined_rank,
      r.search_type,
      r.snippet
    FROM combined_results r
    ORDER BY r.combined_rank DESC, r.published_at DESC
    LIMIT search_limit
    OFFSET search_offset;
  ELSE
    RETURN QUERY
    SELECT 
      a.id,
      a.slug,
      a.title,
      a.summary,
      a.published_at,
      a.read_time_minutes,
      ts_rank_cd(a.tsv, search_query) as fts_rank,
      0.0::real as semantic_rank,
      ts_rank_cd(a.tsv, search_query) as combined_rank,
      'text'::text as search_type,
      CASE 
        WHEN a.summary IS NOT NULL AND length(trim(a.summary)) > 0 THEN
          ts_headline('simple', a.summary, search_query, 'MaxWords=50, MinWords=20, ShortWord=3')
        ELSE
          ts_headline('simple', 
            regexp_replace(coalesce(a.body, ''), '<[^>]*>', '', 'g'), 
            search_query, 
            'MaxWords=50, MinWords=20, ShortWord=3'
          )
      END as snippet
    FROM public.articles a
    WHERE 
      a.status = 'published'
      AND a.published_at <= now()
      AND a.tsv @@ search_query
    ORDER BY 
      ts_rank_cd(a.tsv, search_query) DESC,
      a.published_at DESC
    LIMIT search_limit
    OFFSET search_offset;
  END IF;
END;
$$;

-- Comments utility functions: ensure search_path on timestamp/like count triggers
CREATE OR REPLACE FUNCTION public.update_comment_likes_count()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public, pg_temp
AS $$
BEGIN
  UPDATE public.article_comments 
  SET likes_count = (
    SELECT COUNT(*) FROM public.comment_reactions 
    WHERE comment_id = COALESCE(NEW.comment_id, OLD.comment_id) 
    AND reaction_type = 'like'
  ),
  dislikes_count = (
    SELECT COUNT(*) FROM public.comment_reactions 
    WHERE comment_id = COALESCE(NEW.comment_id, OLD.comment_id) 
    AND reaction_type = 'dislike'
  )
  WHERE id = COALESCE(NEW.comment_id, OLD.comment_id);
  RETURN COALESCE(NEW, OLD);
END;
$$;

CREATE OR REPLACE FUNCTION public.update_comment_timestamp()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public, pg_temp
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Acceptance tests:
--  - Calling these functions should work regardless of current search_path poisoning
--  - No reliance on "$user" or implicit schema resolution


