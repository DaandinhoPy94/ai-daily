-- Create semantic search function with actual query embedding
CREATE OR REPLACE FUNCTION public.semantic_search_with_embedding(
  query_text text,
  query_embedding text, -- JSON string of embedding array
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
SET search_path = public
AS $$
DECLARE
  search_query tsquery;
  embedding_vector vector(1536);
BEGIN
  -- Return empty result for empty queries
  IF query_text IS NULL OR trim(query_text) = '' THEN
    RETURN;
  END IF;

  -- Parse the embedding JSON string to vector
  BEGIN
    embedding_vector := query_embedding::vector;
  EXCEPTION WHEN OTHERS THEN
    -- If embedding parsing fails, fall back to FTS only
    RETURN QUERY
    SELECT * FROM public.hybrid_search(query_text, search_limit, search_offset, 0.0);
    RETURN;
  END;

  -- Create search query for FTS
  BEGIN
    search_query := websearch_to_tsquery('simple', trim(query_text));
  EXCEPTION WHEN OTHERS THEN
    search_query := plainto_tsquery('simple', trim(query_text));
  END;

  IF search_query IS NULL THEN
    RETURN;
  END IF;

  -- Perform hybrid search
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
      1.0 - (ae.embedding <=> embedding_vector) as rank,
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
    ORDER BY ae.embedding <=> embedding_vector
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
      -- Normalize and combine scores
      (
        (COALESCE(f.rank, 0.0) / GREATEST(COALESCE(MAX(f.rank) OVER(), 0.001), 0.001)) * (1.0 - semantic_weight) + 
        (COALESCE(s.rank, 0.0) / GREATEST(COALESCE(MAX(s.rank) OVER(), 0.001), 0.001)) * semantic_weight
      ) as combined_rank,
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
END;
$$;

-- Grant permissions
GRANT EXECUTE ON FUNCTION public.semantic_search_with_embedding(text, text, int, int, real) TO anon, authenticated;