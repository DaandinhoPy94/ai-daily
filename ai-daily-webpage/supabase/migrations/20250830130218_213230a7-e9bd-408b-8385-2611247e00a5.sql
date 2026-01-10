-- Enable RLS on all public tables that don't have it enabled yet
ALTER TABLE public.ai_endpoints ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_requests ENABLE ROW LEVEL SECURITY;