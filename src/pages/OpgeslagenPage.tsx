import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { supabase } from '@/integrations/supabase/client';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { TabletAppShell } from '@/components/TabletAppShell';
import { BookmarkedArticleListRow } from '@/components/lists/BookmarkedArticleListRow';
import { getDefaultSEO, buildCanonical } from '@/lib/seo';
import { useAuth } from '@/contexts/AuthContext';

type BookmarkRecord = {
  created_at: string;
  article: any;
};

export default function OpgeslagenPage() {
  const [viewType, setViewType] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');
  const [bookmarks, setBookmarks] = useState<BookmarkRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, loading: authLoading } = useAuth();

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
    if (authLoading) return;
    if (!user) {
      setBookmarks([]);
      setLoading(false);
      return;
    }
    const fetchBookmarks = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data, error } = await (supabase as any)
          .from('bookmarks')
          .select(`
            created_at,
            article:articles (
              id,
              slug,
              title,
              read_time_minutes,
              hero_image_id,
              topics ( name ),
              media_assets:media_assets!articles_hero_image_id_fkey ( path )
            )
          `)
          .order('created_at', { ascending: false });

        if (error) throw error;

        const mapped: BookmarkRecord[] = (data || []).map((row: any) => {
          const art = row.article || {};
          return {
            created_at: row.created_at,
            article: {
              ...art,
              media_asset_url: art?.media_assets?.path,
              media_asset_alt: art?.media_assets?.alt,
            },
          };
        });

        setBookmarks(mapped);
      } catch (err: any) {
        console.error('Error fetching bookmarks:', err);
        setError('Kon opgeslagen artikelen niet laden.');
      } finally {
        setLoading(false);
      }
    };

    fetchBookmarks();
  }, [user, authLoading]);

  const defaults = getDefaultSEO();
  const pageTitle = 'Opgeslagen artikelen';
  const canonical = buildCanonical('/opgeslagen');

  const content = (
    <>
      <Helmet>
        <html lang="nl" />
        <title>{pageTitle}</title>
        <meta name="description" content="Je persoonlijk opgeslagen artikelen. Blijf bij wat je later wilt lezen." />
        <link rel="canonical" href={canonical} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content="Je persoonlijk opgeslagen artikelen." />
        <meta property="og:url" content={canonical} />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content="Je persoonlijk opgeslagen artikelen." />
      </Helmet>

      <div className={`container mx-auto px-4 sm:px-6 lg:px-8 max-w-screen-xl ${viewType === 'mobile' || viewType === 'tablet' ? 'py-4' : 'py-8'}`}>
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold font-serif text-foreground mb-4">
            {pageTitle}
          </h1>
          <hr className="border-border" />
        </div>

        <section className="bg-card rounded-lg border border-border">
          {loading ? (
            <div className="p-8 text-center">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent motion-reduce:animate-[spin_1.5s_linear_infinite]" />
            </div>
          ) : !user ? (
            <div className="p-8 text-center text-muted-foreground">
              Log in om je opgeslagen artikelen te bekijken.
            </div>
          ) : bookmarks.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              Je hebt nog geen artikelen opgeslagen.
            </div>
          ) : (
            <div>
              {bookmarks.map((bm, index) => (
                <BookmarkedArticleListRow
                  key={`${bm.article?.id}-${bm.created_at}`}
                  bookmark={bm}
                  showDivider={index < bookmarks.length - 1}
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </>
  );

  if (viewType === 'mobile' || viewType === 'tablet') {
    return (
      <TabletAppShell viewType={viewType} activeTab="Opgeslagen">
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


