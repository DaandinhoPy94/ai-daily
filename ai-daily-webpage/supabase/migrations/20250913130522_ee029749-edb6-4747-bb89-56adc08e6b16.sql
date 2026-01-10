-- Update v_latest_published view to include media assets
CREATE OR REPLACE VIEW public.v_latest_published AS
SELECT 
    a.id,
    a.slug,
    a.title,
    a.summary,
    a.published_at,
    a.topic_id,
    a.read_time_minutes,
    ma.path as image_path,
    ma.alt as image_alt
FROM articles a
LEFT JOIN media_assets ma ON a.hero_image_id = ma.id
WHERE a.status = 'published'::article_status 
AND a.published_at <= now()
ORDER BY a.published_at DESC;

-- Update v_most_read_24h view to include media assets
CREATE OR REPLACE VIEW public.v_most_read_24h AS
SELECT 
    a.id,
    a.slug,
    a.title,
    a.summary,
    a.published_at,
    COALESCE(v.views_24h, 0) AS views_24h,
    ma.path as image_path,
    ma.alt as image_alt
FROM articles a
LEFT JOIN v_article_views_24h v ON v.article_id = a.id
LEFT JOIN media_assets ma ON a.hero_image_id = ma.id
WHERE a.status = 'published'::article_status 
AND a.published_at <= now()
ORDER BY COALESCE(v.views_24h, 0) DESC, a.published_at DESC;