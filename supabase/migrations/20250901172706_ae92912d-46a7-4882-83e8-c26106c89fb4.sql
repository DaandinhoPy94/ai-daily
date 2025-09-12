-- Insert LM Arena topic
INSERT INTO public.topics (name, slug, display_order, is_active) VALUES 
  ('LM Arena', 'lm-arena', 5, true)
ON CONFLICT (slug) DO NOTHING;