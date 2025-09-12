import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { supabase } from '@/integrations/supabase/client';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { TabletAppShell } from '@/components/TabletAppShell';
import { ArticleListRow } from '@/components/ArticleListRow';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { getDefaultSEO, buildCanonical } from '@/lib/seo';

interface Article {
  id: string;
  slug: string;
  title: string;
  published_at: string;
  readTimeMinutes: number;
  imagePath?: string;
}

const ARTICLES_PER_PAGE = 30;

export default function NetBinnen() {
  const [viewType, setViewType] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');
  const [searchParams, setSearchParams] = useSearchParams();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);

  const currentPage = parseInt(searchParams.get('page') || '1', 10);
  const totalPages = Math.ceil(totalCount / ARTICLES_PER_PAGE);

  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      if (width < 768) setViewType('mobile');
      else if (width >= 768 && width <= 1024) setViewType('tablet');
      else setViewType('desktop');
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  useEffect(() => {
    fetchArticles();
  }, [currentPage]);

  const fetchArticles = async () => {
    setLoading(true);
    try {
      const offset = (currentPage - 1) * ARTICLES_PER_PAGE;
      const { count } = await supabase
        .from('articles')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'published')
        .lte('published_at', new Date().toISOString());

      const { data, error } = await supabase
        .from('articles')
        .select(`
          id,
          slug,
          title,
          published_at,
          read_time_minutes,
          hero_image_id,
          media_assets!articles_hero_image_id_fkey (
            path
          )
        `)
        .eq('status', 'published')
        .lte('published_at', new Date().toISOString())
        .order('published_at', { ascending: false })
        .range(offset, offset + ARTICLES_PER_PAGE - 1);

      if (error) {
        console.error('Error fetching articles:', error);
        return;
      }

      const formattedArticles = data?.map(article => ({
        id: article.id,
        slug: article.slug,
        title: article.title,
        published_at: article.published_at,
        readTimeMinutes: article.read_time_minutes,
        imagePath: article.media_assets?.path,
      })) || [];

      setArticles(formattedArticles);
      setTotalCount(count || 0);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

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

  const defaults = getDefaultSEO();
  const pageTitle = currentPage > 1 ? `Net binnen - Pagina ${currentPage}` : 'Net binnen';
  const canonical = buildCanonical(currentPage > 1 ? `/net-binnen?page=${currentPage}` : '/net-binnen');

  const content = (
    <>
      <Helmet>
        <html lang="nl" />
        <title>{pageTitle}</title>
        <meta name="description" content="Het nieuwste AI nieuws en laatste ontwikkelingen in kunstmatige intelligentie. Blijf op de hoogte van alle breaking news." />
        <link rel="canonical" href={canonical} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content="Het nieuwste AI nieuws en laatste ontwikkelingen in kunstmatige intelligentie." />
        <meta property="og:url" content={canonical} />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content="Het nieuwste AI nieuws en laatste ontwikkelingen in kunstmatige intelligentie." />
      </Helmet>
      
      <div className={`container mx-auto px-4 sm:px-6 lg:px-8 max-w-screen-xl ${viewType === 'mobile' || viewType === 'tablet' ? 'py-4' : 'py-8'}`}>
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold font-serif text-foreground mb-4">
          Net binnen
        </h1>
        <hr className="border-border" />
      </div>
      <section className="bg-card rounded-lg border border-border">
        {loading ? (
          <div className="p-8 text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent motion-reduce:animate-[spin_1.5s_linear_infinite]" />
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
    </>
  );

  if (viewType === 'mobile' || viewType === 'tablet') {
    return (
      <TabletAppShell viewType={viewType} activeTab="NetBinnen">
        {content}
      </TabletAppShell>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>{content}</main>
      <Footer />
    </div>
  );
}
