-- Add subtitle column to articles table
ALTER TABLE public.articles 
ADD COLUMN subtitle text;