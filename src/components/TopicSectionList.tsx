import { useState, useEffect } from 'react';
import { ArticleListRow } from '@/components/ArticleListRow';
import { supabase } from '@/integrations/supabase/client';

interface Article {
  id: string;
  slug: string;
  title: string;
  published_at: string;
  readTimeMinutes: number;
  media_asset_url?: string;
  media_asset_alt?: string;
}

interface TopicSectionListProps {
  topic: {
    id: string;
    slug: string;
    name: string;
    type?: string;
  };
}

export function TopicSectionList({ topic }: TopicSectionListProps) {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticles = async () => {
      if (!topic) return;
      
      setLoading(true);
      try {
        // Get articles linked to this topic
        let articlesQuery = supabase
          .from('articles')
          .select(`
            id,
            slug,
            title,
            published_at,
            read_time_minutes,
            primary_topic_id,
            media_assets!articles_hero_image_id_fkey (
              path,
              alt
            )
          `)
          .eq('status', 'published')
          .lte('published_at', new Date().toISOString())
          .order('published_at', { ascending: false });

        // If main topic, include articles from subcategories
        if (topic.type === 'main') {
          // Get all subtopic IDs for this main topic
          const { data: subTopics } = await supabase
            .from('topics')
            .select('id')
            .eq('parent_slug', topic.slug)
            .eq('is_active', true);

          const subTopicIds = subTopics?.map(t => t.id) || [];
          const allTopicIds = [topic.id, ...subTopicIds];
          
          // Query articles that have primary_topic_id matching any of these topics
          articlesQuery = (articlesQuery as any).in('primary_topic_id', allTopicIds);
        } else {
          // Sub topic - articles with this topic as primary_topic_id
          articlesQuery = (articlesQuery as any).eq('primary_topic_id', topic.id);
        }

        const { data: articlesData } = await articlesQuery.limit(50);

        const formattedArticles: Article[] = (articlesData as any[] || []).map((article: any) => ({
          id: article.id,
          slug: article.slug,
          title: article.title,
          published_at: article.published_at,
          readTimeMinutes: article.read_time_minutes,
          media_asset_url: article.media_assets?.path,
          media_asset_alt: article.media_assets?.alt
        }));

        setArticles(formattedArticles);
      } catch (error) {
        console.error('Error fetching articles:', error);
        setArticles([]);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, [topic]);

  if (loading) {
    return (
      <section className="bg-card rounded-lg border border-border">
        <div className="p-8 text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-card rounded-lg border border-border">
      {articles.length === 0 ? (
        <div className="p-8 text-center text-muted-foreground">
          Nog geen artikelen voor dit onderwerp.
        </div>
      ) : (
        <div role="list">
          {articles.map((article, index) => (
            <ArticleListRow
              key={article.id}
              article={article}
              showDivider={index < articles.length - 1}
            />
          ))}
        </div>
      )}
    </section>
  );
}