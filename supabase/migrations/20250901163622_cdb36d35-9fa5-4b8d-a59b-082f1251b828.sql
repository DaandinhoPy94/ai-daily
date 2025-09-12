-- Fix the trigger to properly handle OAuth signups
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Update the trigger function to handle all auth methods including OAuth
CREATE OR REPLACE FUNCTION public.handle_new_auth_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
begin
  insert into public.profiles (user_id, display_name, role, avatar_url)
  values (
    new.id, 
    coalesce(
      new.raw_user_meta_data->>'full_name',
      new.raw_user_meta_data->>'name', 
      split_part(new.email,'@',1)
    ), 
    'reader', 
    new.raw_user_meta_data->>'avatar_url'
  )
  on conflict (user_id) do nothing;
  return new;
end
$function$;

-- Recreate the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_auth_user();

-- Create profile for existing Google user (replace with actual user ID from auth.users)
-- First, let's see what users exist without profiles
INSERT INTO public.profiles (user_id, display_name, role, avatar_url)
SELECT 
  au.id,
  coalesce(
    au.raw_user_meta_data->>'full_name',
    au.raw_user_meta_data->>'name',
    split_part(au.email,'@',1)
  ),
  'reader',
  au.raw_user_meta_data->>'avatar_url'
FROM auth.users au
LEFT JOIN public.profiles p ON p.user_id = au.id
WHERE p.user_id IS NULL
ON CONFLICT (user_id) DO NOTHING;