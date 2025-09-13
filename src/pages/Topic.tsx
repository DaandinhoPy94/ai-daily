import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { SectionList } from '@/components/SectionList';
import { getTopicBySlug } from '@/lib/supabase';
import { getTopicSEO, buildCanonical } from '@/lib/seo';
import NotFound from '@/pages/NotFound';

export default function Topic() {
  const { slug } = useParams<{ slug: string }>();
  const [topic, setTopic] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTopic = async () => {
      if (!slug) {
        setLoading(false);
        return;
      }

      try {
        const topicData = await getTopicBySlug(slug);
        setTopic(topicData);
      } catch (error) {
        console.error('Error fetching topic:', error);
        setTopic(null);
      } finally {
        setLoading(false);
      }
    };

    fetchTopic();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
      </div>
    );
  }

  if (!topic || !slug) {
    return <NotFound />;
  }

  const seo = getTopicSEO(topic.name);
  const canonical = buildCanonical(`/${slug}`);

  return (
    <>
      <Helmet>
        <html lang="nl" />
        <title>{seo.title}</title>
        <meta name="description" content={seo.description} />
        <link rel="canonical" href={canonical} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={seo.title} />
        <meta property="og:description" content={seo.description} />
        <meta property="og:url" content={canonical} />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={seo.title} />
        <meta name="twitter:description" content={seo.description} />
      </Helmet>
      <SectionList title={topic.name} topicSlug={topic.slug} />
    </>
  );
}