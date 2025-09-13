-- Function to create default media asset for new articles
CREATE OR REPLACE FUNCTION public.create_default_media_asset()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_media_id uuid;
BEGIN
  -- Only create media asset if hero_image_id is NULL
  IF NEW.hero_image_id IS NULL THEN
    -- Create a new media asset with default placeholder
    INSERT INTO public.media_assets (
      type,
      path,
      alt,
      title
    ) VALUES (
      'image',
      'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=450&fit=crop',
      COALESCE(NEW.title, 'Artikel afbeelding'),
      COALESCE(NEW.title, 'Artikel afbeelding')
    )
    RETURNING id INTO new_media_id;
    
    -- Update the article's hero_image_id to point to the new media asset
    NEW.hero_image_id := new_media_id;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger to automatically create media assets for new articles
DROP TRIGGER IF EXISTS trg_create_default_media_asset ON public.articles;
CREATE TRIGGER trg_create_default_media_asset
  BEFORE INSERT ON public.articles
  FOR EACH ROW
  EXECUTE FUNCTION public.create_default_media_asset();