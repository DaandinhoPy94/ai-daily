-- Purpose: Remove/replace unnecessary SECURITY DEFINER; add explicit search_path; harden remaining auth bootstrap

SET search_path = public, pg_temp;

-- 1) Convert create_default_media_asset to SECURITY INVOKER with explicit search_path
CREATE OR REPLACE FUNCTION public.create_default_media_asset()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public, pg_temp
AS $$
DECLARE
  new_media_id uuid;
BEGIN
  IF NEW.hero_image_id IS NULL THEN
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
    NEW.hero_image_id := new_media_id;
  END IF;
  RETURN NEW;
END;
$$;

-- 2) Harden handle_new_auth_user: keep DEFINER (fires on auth.users) but add explicit search_path and defend against misuse
--    Only operate when current_user is the Supabase auth role (auth trigger context) or service_role
CREATE OR REPLACE FUNCTION public.handle_new_auth_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $function$
DECLARE
  jwt_claims text := current_setting('request.jwt.claims', true);
  jwt jsonb := NULLIF(jwt_claims, '')::jsonb;
  is_service boolean := coalesce(jwt->>'role','') = 'service_role';
BEGIN
  -- guard: only allow execution in trusted contexts
  IF NOT is_service AND current_user NOT IN ('authenticator', 'postgres') THEN
    RETURN NEW; -- no-op if somehow invoked outside expected context
  END IF;

  INSERT INTO public.profiles (user_id, display_name, role, avatar_url)
  VALUES (
    NEW.id,
    coalesce(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email,'@',1), 'Gebruiker'),
    'reader',
    NEW.raw_user_meta_data->>'avatar_url'
  )
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END
$function$;

-- 3) Drop obsolete handle_new_user (older bootstrap) if present
DO $$ BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_proc WHERE proname = 'handle_new_user' AND pronamespace = 'public'::regnamespace
  ) THEN
    DROP FUNCTION public.handle_new_user();
  END IF;
END $$;

-- Acceptance tests:
-- - Insert into auth.users triggers profile creation; function runs with DEFINER but respects guard and search_path
-- - App-side calls to create_default_media_asset proceed under caller privileges and respect RLS


