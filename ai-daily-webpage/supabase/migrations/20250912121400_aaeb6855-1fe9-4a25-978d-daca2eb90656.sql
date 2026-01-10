-- Add foreign key constraint from articles.hero_image_id to media_assets.id
ALTER TABLE public.articles 
ADD CONSTRAINT fk_articles_hero_image_id 
FOREIGN KEY (hero_image_id) 
REFERENCES public.media_assets(id) 
ON DELETE SET NULL;