import { useState, useEffect } from 'react';
import { useSearchParams, useLocation } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { MobileHeader } from '@/components/MobileHeader';
import { BottomTabBar } from '@/components/BottomTabBar';
import { TabletAppShell } from '@/components/TabletAppShell';
import { ArticleListRow } from '@/components/ArticleListRow';
import { supabase } from '@/integrations/supabase/client';
import { Helmet } from 'react-helmet-async';
import { buildCanonical } from '@/lib/seo';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

interface Article {
  id: string;
  slug: string;
  title: string;
  published_at: string;
  readTimeMinutes: number;
  media_asset_url?: string;
}

interface SectionListProps {
  title: string;
  topicSlug: string;
  isWrappedInAppShell?: boolean;
}

const ARTICLES_PER_PAGE = 30;

// Main topic slugs that should have fixed bottom navigation
const MAIN_TOPIC_SLUGS = [
  'onderzoek-ontwikkeling',
  'technologie-modellen', 
  'toepassingen',
  'bedrijven-markt',
  'geografie-politiek',
  'veiligheid-regelgeving',
  'economie-werk',
  'cultuur-samenleving'
];

export function SectionList({ title, topicSlug, isWrappedInAppShell = false }: SectionListProps) {
  const [viewType, setViewType] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');
  const location = useLocation();

  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      if (width < 768) {
        setViewType('mobile');
      } else if (width >= 768 && width <= 1024) {
        setViewType('tablet');
      } else {
        setViewType('desktop');
      }
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);
  const [searchParams, setSearchParams] = useSearchParams();
  const [articles, setArticles] = useState<Article[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  
  const currentPage = parseInt(searchParams.get('page') || '1', 10);
  const totalPages = Math.ceil(totalCount / ARTICLES_PER_PAGE);

  useEffect(() => {
    const fetchArticles = async () => {
      setLoading(true);
      try {
        // First get the topic ID
        const { data: topicData } = await supabase
          .from('topics')
          .select('id')
          .eq('slug', topicSlug)
          .eq('is_active', true)
          .single();

        if (!topicData) {
          setArticles([]);
          setTotalCount(0);
          setLoading(false);
          return;
        }

        // Get total count for pagination
        const { count } = await supabase
          .from('articles')
          .select('*', { count: 'exact', head: true })
          .eq('topic_id', topicData.id)
          .eq('status', 'published')
          .lte('published_at', new Date().toISOString());

        setTotalCount(count || 0);

        // Get articles with media for the current page
        const { data: articlesData } = await supabase
          .from('articles')
          .select(`
            id,
            slug,
            title,
            published_at,
            read_time_minutes,
            hero_image_id,
            media_assets!articles_hero_image_id_fkey (
              path,
              alt
            )
          `)
          .eq('topic_id', topicData.id)
          .eq('status', 'published')
          .lte('published_at', new Date().toISOString())
          .order('published_at', { ascending: false })
          .range((currentPage - 1) * ARTICLES_PER_PAGE, currentPage * ARTICLES_PER_PAGE - 1);

        const formattedArticles: Article[] = (articlesData || []).map(article => ({
          id: article.id,
          slug: article.slug,
          title: article.title,
          published_at: article.published_at,
          readTimeMinutes: article.read_time_minutes,
          media_asset_url: article.media_assets?.path
        }));

        setArticles(formattedArticles);
      } catch (error) {
        console.error('Error fetching articles:', error);
        setArticles([]);
        setTotalCount(0);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, [topicSlug, currentPage]);

  const handlePageChange = (page: number) => {
    setSearchParams({ page: page.toString() });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderPaginationItems = () => {
    const items = [];
    const maxVisiblePages = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    if (startPage > 1) {
      items.push(
        <PaginationItem key="1">
          <PaginationLink onClick={() => handlePageChange(1)}>1</PaginationLink>
        </PaginationItem>
      );
      if (startPage > 2) {
        items.push(
          <PaginationItem key="ellipsis-start">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      items.push(
        <PaginationItem key={i}>
          <PaginationLink
            onClick={() => handlePageChange(i)}
            isActive={currentPage === i}
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        items.push(
          <PaginationItem key="ellipsis-end">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }
      items.push(
        <PaginationItem key={totalPages}>
          <PaginationLink onClick={() => handlePageChange(totalPages)}>
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }

    return items;
  };

  // Check if current route is a main topic slug
  const isMainTopicSlug = MAIN_TOPIC_SLUGS.includes(location.pathname.slice(1));

  const content = (
    <div className={`container mx-auto px-4 sm:px-6 lg:px-8 max-w-screen-xl ${isWrappedInAppShell ? 'py-4' : 'py-8'} ${
      isMainTopicSlug && viewType === 'mobile' ? 'pb-20' : ''
    }`}>
      <Helmet>
        <link rel="canonical" href={buildCanonical(location.pathname + (currentPage > 1 ? `?page=${currentPage}` : ''))} />
        {currentPage > 1 && (
          <link rel="prev" href={buildCanonical(location.pathname + (currentPage > 2 ? `?page=${currentPage - 1}` : ''))} />
        )}
        {currentPage < totalPages && (
          <link rel="next" href={buildCanonical(location.pathname + `?page=${currentPage + 1}`)} />
        )}
      </Helmet>
      {/* Title Section */}
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold font-serif text-foreground mb-4">
          {title}
        </h1>
        <hr className="border-border" />
      </div>

      {/* Article List */}
      <section className="bg-card rounded-lg border border-border">
        {loading ? (
          <div className="p-8 text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
          </div>
        ) : articles.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            Geen artikelen gevonden.
          </div>
        ) : (
          <div>
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

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-8 flex justify-center">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                  className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                />
              </PaginationItem>
              
              {renderPaginationItems()}
              
              <PaginationItem>
                <PaginationNext 
                  onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                  className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );

  // If wrapped in app shell (tablet/mobile from parent), just return content
  if (isWrappedInAppShell) {
    return content;
  }

  if (viewType === 'tablet') {
    return (
      <TabletAppShell viewType="tablet">
        {content}
      </TabletAppShell>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {viewType === 'mobile' ? <MobileHeader /> : <Header />}
      
      <main>
        {content}
      </main>

      {viewType === 'mobile' ? <BottomTabBar viewType="mobile" /> : <Footer />}
    </div>
  );
}