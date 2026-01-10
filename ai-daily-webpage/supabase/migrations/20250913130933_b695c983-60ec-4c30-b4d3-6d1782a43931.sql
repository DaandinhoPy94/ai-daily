-- Update existing articles that don't have a hero_image_id
DO $$
DECLARE
    article_record RECORD;
    new_media_id uuid;
BEGIN
    -- Loop through articles that don't have a hero_image_id
    FOR article_record IN 
        SELECT id, title FROM public.articles WHERE hero_image_id IS NULL
    LOOP
        -- Create a new media asset for each article
        INSERT INTO public.media_assets (
            type,
            path,
            alt,
            title
        ) VALUES (
            'image',
            'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=450&fit=crop',
            COALESCE(article_record.title, 'Artikel afbeelding'),
            COALESCE(article_record.title, 'Artikel afbeelding')
        )
        RETURNING id INTO new_media_id;
        
        -- Update the article's hero_image_id
        UPDATE public.articles 
        SET hero_image_id = new_media_id 
        WHERE id = article_record.id;
    END LOOP;
END
$$;