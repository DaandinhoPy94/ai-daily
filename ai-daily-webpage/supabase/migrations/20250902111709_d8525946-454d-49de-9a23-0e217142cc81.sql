-- Enable RLS on new tables and create policies
ALTER TABLE public.article_embeddings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.embedding_jobs ENABLE ROW LEVEL SECURITY;

-- Policies for article_embeddings - public read for published articles, editors can manage
CREATE POLICY "article_embeddings_public_read" 
ON public.article_embeddings 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.articles a 
    WHERE a.id = article_embeddings.article_id 
    AND a.status = 'published' 
    AND a.published_at <= now()
  )
);

CREATE POLICY "article_embeddings_editor_manage" 
ON public.article_embeddings 
FOR ALL 
USING (is_editor())
WITH CHECK (is_editor());

-- Policies for embedding_jobs - only editors can see and manage
CREATE POLICY "embedding_jobs_editor_read" 
ON public.embedding_jobs 
FOR SELECT 
USING (is_editor());

CREATE POLICY "embedding_jobs_editor_manage" 
ON public.embedding_jobs 
FOR ALL 
USING (is_editor())
WITH CHECK (is_editor());