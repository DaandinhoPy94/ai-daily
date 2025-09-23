-- Fails when there are public SELECT policies outside the allowlist
-- Allowlist: articles_sitemap, job_listings, lm_arena_leaderboard_snapshots, public_profiles (view)

WITH public_selects AS (
  SELECT 
    p.schemaname,
    p.tablename,
    p.policyname,
    pg_get_expr(po.polqual, po.polrelid) AS using_expr,
    pg_get_expr(po.polwithcheck, po.polrelid) AS withcheck_expr,
    po.polcmd
  FROM pg_policies p
  JOIN pg_policy po ON po.polname = p.policyname AND po.polrelid = (quote_ident(p.schemaname)||'.'||quote_ident(p.tablename))::regclass
  WHERE p.schemaname = 'public'
    AND po.polcmd = 'r'
), offenders AS (
  SELECT * FROM public_selects
  WHERE (
    using_expr IS NULL OR using_expr = 'true'
  )
  AND tablename NOT IN ('articles_sitemap','job_listings','lm_arena_leaderboard_snapshots','public_profiles')
)
SELECT CASE WHEN EXISTS (SELECT 1 FROM offenders)
  THEN
    (SELECT 'Found unexpected public SELECT policies:\n' || string_agg(policyname || ' on ' || tablename, E'\n') FROM offenders)
  ELSE 'OK' END AS result;

