-- Enable RLS on new tables
ALTER TABLE public.article_embeddings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.embedding_jobs ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for article_embeddings (public read, editor manage)
CREATE POLICY "Public can view article embeddings" 
ON public.article_embeddings 
FOR SELECT 
USING (true);

CREATE POLICY "Editors can manage article embeddings" 
ON public.article_embeddings 
FOR ALL 
USING (is_editor())
WITH CHECK (is_editor());

-- Create RLS policies for embedding_jobs (editor only)
CREATE POLICY "Editors can manage embedding jobs" 
ON public.embedding_jobs 
FOR ALL 
USING (is_editor())
WITH CHECK (is_editor());