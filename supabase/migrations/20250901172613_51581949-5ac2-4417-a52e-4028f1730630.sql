-- Insert topics for the new navigation items
INSERT INTO public.topics (name, slug, display_order, is_active) VALUES 
  ('China', 'china', 10, true),
  ('VS', 'vs', 20, true),
  ('Europa', 'europa', 30, true),
  ('Research', 'research', 40, true),
  ('Regelgeving', 'regelgeving', 50, true)
ON CONFLICT (slug) DO NOTHING;