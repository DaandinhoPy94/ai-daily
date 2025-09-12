-- Add image variant columns to articles table
ALTER TABLE public.articles 
ADD COLUMN image_large TEXT,
ADD COLUMN image_standard TEXT,
ADD COLUMN image_mobile TEXT,
ADD COLUMN image_tablet TEXT,
ADD COLUMN image_list TEXT;