-- Create article comments table
CREATE TABLE public.article_comments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  article_id UUID NOT NULL REFERENCES public.articles(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  parent_id UUID NULL REFERENCES public.article_comments(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  likes_count INTEGER NOT NULL DEFAULT 0,
  dislikes_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.article_comments ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can read comments on published articles" 
ON public.article_comments 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.articles a
    WHERE a.id = article_comments.article_id 
    AND a.status = 'published' 
    AND a.published_at <= now()
  )
);

CREATE POLICY "Authenticated users can create comments" 
ON public.article_comments 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own comments" 
ON public.article_comments 
FOR UPDATE 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own comments" 
ON public.article_comments 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create comment likes/dislikes table
CREATE TABLE public.comment_reactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  comment_id UUID NOT NULL REFERENCES public.article_comments(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  reaction_type TEXT NOT NULL CHECK (reaction_type IN ('like', 'dislike')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(comment_id, user_id)
);

-- Enable RLS
ALTER TABLE public.comment_reactions ENABLE ROW LEVEL SECURITY;

-- Create policies for reactions
CREATE POLICY "Anyone can read reactions" 
ON public.comment_reactions 
FOR SELECT 
USING (true);

CREATE POLICY "Authenticated users can manage their reactions" 
ON public.comment_reactions 
FOR ALL 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX idx_article_comments_article_id ON public.article_comments(article_id);
CREATE INDEX idx_article_comments_parent_id ON public.article_comments(parent_id);
CREATE INDEX idx_article_comments_created_at ON public.article_comments(created_at);
CREATE INDEX idx_comment_reactions_comment_id ON public.comment_reactions(comment_id);

-- Create trigger to update comment counts
CREATE OR REPLACE FUNCTION update_comment_likes_count()
RETURNS TRIGGER AS $$
BEGIN
  -- Update likes count
  UPDATE public.article_comments 
  SET likes_count = (
    SELECT COUNT(*) FROM public.comment_reactions 
    WHERE comment_id = COALESCE(NEW.comment_id, OLD.comment_id) 
    AND reaction_type = 'like'
  ),
  dislikes_count = (
    SELECT COUNT(*) FROM public.comment_reactions 
    WHERE comment_id = COALESCE(NEW.comment_id, OLD.comment_id) 
    AND reaction_type = 'dislike'
  )
  WHERE id = COALESCE(NEW.comment_id, OLD.comment_id);
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Create trigger
CREATE TRIGGER trigger_update_comment_likes_count
  AFTER INSERT OR UPDATE OR DELETE ON public.comment_reactions
  FOR EACH ROW
  EXECUTE FUNCTION update_comment_likes_count();

-- Create timestamp trigger function
CREATE OR REPLACE FUNCTION update_comment_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
CREATE TRIGGER trigger_update_comment_timestamp
  BEFORE UPDATE ON public.article_comments
  FOR EACH ROW
  EXECUTE FUNCTION update_comment_timestamp();