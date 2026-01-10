-- Fix search_articles function to have stable search_path
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
SET search_path = public
AS $$
DECLARE
  search_query tsquery;
BEGIN
  -- Return empty result for empty queries
  IF q IS NULL OR trim(q) = '' THEN
    RETURN;
  END IF;

  -- Create search query using websearch_to_tsquery for user-friendly syntax
  BEGIN
    search_query := websearch_to_tsquery('simple', trim(q));
  EXCEPTION WHEN OTHERS THEN
    -- Fallback to plainto_tsquery if websearch fails
    search_query := plainto_tsquery('simple', trim(q));
  END;

  -- Return empty result if query parsing failed
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
    -- Use ts_headline on summary for better performance, fallback to body if summary is empty
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