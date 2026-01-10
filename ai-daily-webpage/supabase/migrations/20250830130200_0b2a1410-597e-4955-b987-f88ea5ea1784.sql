-- Enable RLS on views that have policies but RLS disabled
ALTER TABLE public.v_article_views_24h ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.v_homepage_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.v_latest_published ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.v_most_read_24h ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.v_ticker_latest ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.v_topic_sections_cards ENABLE ROW LEVEL SECURITY;

-- Add policies for public read access to the views
CREATE POLICY "read v_article_views_24h" ON public.v_article_views_24h FOR SELECT USING (true);
CREATE POLICY "read v_homepage_slots" ON public.v_homepage_slots FOR SELECT USING (true);
CREATE POLICY "read v_latest_published" ON public.v_latest_published FOR SELECT USING (true);
CREATE POLICY "read v_most_read_24h" ON public.v_most_read_24h FOR SELECT USING (true);
CREATE POLICY "read v_ticker_latest" ON public.v_ticker_latest FOR SELECT USING (true);
CREATE POLICY "read v_topic_sections_cards" ON public.v_topic_sections_cards FOR SELECT USING (true);