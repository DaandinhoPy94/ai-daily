-- Allow public reading of profile display names and avatars for comments
CREATE POLICY "Public can read profile display info" 
ON public.profiles 
FOR SELECT 
USING (true);