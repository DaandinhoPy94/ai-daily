import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { MobileHeader } from '../components/MobileHeader';
import { BottomTabBar } from '../components/BottomTabBar';
import { TabletAppShell } from '../components/TabletAppShell';
import { ShareBar } from '../components/ShareBar';
import { TripleDivider } from '../components/TripleDivider';
import { RightRailLatest } from '../components/RightRailLatest';
import { RelatedList } from '../components/RelatedList';
import { RelatedTopics } from '../components/RelatedTopics';
import { ArticleComments } from '../components/ArticleComments';
import { Toaster } from '@/components/ui/toaster';
import { getLatest } from '../lib/supabase';
import { supabase } from '@/integrations/supabase/client';
import { buildCanonical, getDefaultSEO } from '../lib/seo';

interface Paper {
  id: string;
  slug: string;
  title: string;
  summary?: string;
  authors?: string[];
  publication_date?: string;
  seo_title?: string;
  seo_description?: string;
  cover_icon?: {
    id: string;
    path: string;
    alt?: string;
    title?: string;
  };
}

interface PaperSection {
  id: string;
  section_title?: string;
  content?: string;
  section_order: number;
}

interface PaperFigure {
  id: string;
  type?: string;
  title?: string;
  caption?: string;
  content?: string;
  media_id?: string;
  media_asset?: {
    path: string;
    alt?: string;
    title?: string;
  };
}

interface LatestArticle {
  id: string;
  slug: string;
  title: string;
  published_at: string;
}

export default function PaperPage() {
  const { slug } = useParams<{ slug: string }>();
  const [viewType, setViewType] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');
  const [paper, setPaper] = useState<Paper | null>(null);
  const [sections, setSections] = useState<PaperSection[]>([]);
  const [figures, setFigures] = useState<PaperFigure[]>([]);
  const [latestArticles, setLatestArticles] = useState<LatestArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  useEffect(() => {
    async function fetchData() {
      if (!slug) return;

      try {
        setLoading(true);
        setError(null);

        // Fetch paper data
        const { data: paperData, error: paperError } = await (supabase as any)
          .from('ai_papers')
          .select(`
            id,
            title,
            slug,
            summary,
            authors,
            publication_date,
            seo_title,
            seo_description,
            cover_icon:media_assets(id, path, alt, title)
          `)
          .eq('slug', slug)
          .maybeSingle();

        if (paperError) {
          throw paperError;
        }

        if (!paperData) {
          setError('Paper not found');
          return;
        }

        setPaper(paperData);

        // Fetch paper sections
        const { data: sectionsData, error: sectionsError } = await (supabase as any)
          .from('ai_paper_sections')
          .select('id, section_title, content, section_order')
          .eq('paper_id', paperData.id)
          .order('section_order', { ascending: true });

        if (sectionsError) {
          console.error('Error fetching sections:', sectionsError);
        } else {
          setSections(sectionsData || []);
        }

        // Fetch paper figures
        const { data: figuresData, error: figuresError } = await (supabase as any)
          .from('ai_paper_figures')
          .select(`
            id,
            type,
            title,
            caption,
            content,
            media_id,
            media_asset:media_assets(path, alt, title)
          `)
          .eq('paper_id', paperData.id)
          .in('type', ['table', 'figure', 'equation']);

        if (figuresError) {
          console.error('Error fetching figures:', figuresError);
        } else {
          setFigures(figuresData || []);
        }

        // Fetch latest articles for right rail
        const latest = await getLatest(10);
        setLatestArticles(latest);

      } catch (err) {
        console.error('Error fetching paper:', err);
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [slug]);

  if (loading) {
    const loadingContent = (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          <div className="hidden lg:block lg:col-span-1"></div>
          <article className="lg:col-span-8">
            <div className="animate-pulse space-y-4">
              <div className="h-4 bg-muted rounded w-1/4"></div>
              <div className="h-12 bg-muted rounded"></div>
              <div className="h-4 bg-muted rounded w-1/3"></div>
              <div className="h-32 bg-muted rounded"></div>
              <div className="space-y-2">
                <div className="h-4 bg-muted rounded"></div>
                <div className="h-4 bg-muted rounded"></div>
                <div className="h-4 bg-muted rounded w-3/4"></div>
              </div>
            </div>
          </article>
          <aside className="lg:col-span-3">
            <div className="animate-pulse space-y-4">
              <div className="h-6 bg-muted rounded w-1/2"></div>
              <div className="space-y-2">
                <div className="h-4 bg-muted rounded"></div>
                <div className="h-4 bg-muted rounded"></div>
                <div className="h-4 bg-muted rounded"></div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    );

    if (viewType === 'tablet') {
      return (
        <TabletAppShell viewType="tablet">
          {loadingContent}
          <Toaster />
        </TabletAppShell>
      );
    }

    if (viewType === 'mobile') {
      return (
        <>
          <div className="min-h-screen bg-background" style={{ paddingBottom: 'calc(64px + env(safe-area-inset-bottom))' }}>
            <MobileHeader />
            <main>{loadingContent}</main>
          </div>
          <BottomTabBar viewType="mobile" />
          <Toaster />
        </>
      );
    }

    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main>{loadingContent}</main>
        <Footer />
        <Toaster />
      </div>
    );
  }

  if (error || !paper) {
    const errorContent = (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Paper niet gevonden</h1>
          <p className="text-muted-foreground mb-6">
            {error || 'Het opgevraagde paper kon niet worden gevonden.'}
          </p>
          <a href="/" className="inline-flex items-center text-primary hover:underline">
            ← Terug naar de homepagina
          </a>
        </div>
      </div>
    );

    if (viewType === 'tablet') {
      return (
        <TabletAppShell viewType="tablet">
          {errorContent}
          <Toaster />
        </TabletAppShell>
      );
    }

    if (viewType === 'mobile') {
      return (
        <>
          <div className="min-h-screen bg-background" style={{ paddingBottom: 'calc(64px + env(safe-area-inset-bottom))' }}>
            <MobileHeader />
            <main>{errorContent}</main>
          </div>
          <BottomTabBar viewType="mobile" />
          <Toaster />
        </>
      );
    }

    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main>{errorContent}</main>
        <Footer />
        <Toaster />
      </div>
    );
  }

  const defaults = getDefaultSEO();
  const pageTitle = paper.seo_title || paper.title;
  const pageDescription = paper.seo_description || paper.summary?.slice(0, 160) || defaults.description;
  const canonical = buildCanonical(`/papers/${paper.slug}`);
  const ogImage = paper.cover_icon?.path ? `${defaults.siteUrl}${paper.cover_icon.path}` : defaults.defaultImage;
  
  // Build JSON-LD for ScholarlyArticle
  const jsonLD = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "ScholarlyArticle",
    "headline": paper.title,
    "name": paper.title,
    "description": paper.summary,
    "datePublished": paper.publication_date,
    "author": paper.authors?.map(name => ({
      "@type": "Person",
      "name": name
    })) || [],
    "publisher": {
      "@type": "Organization",
      "name": defaults.siteName,
      "url": defaults.siteUrl
    },
    "url": canonical,
    "image": ogImage
  });

  // Format publication date
  const formattedDate = paper.publication_date 
    ? new Date(paper.publication_date).toLocaleDateString('nl-NL', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      })
    : '';

  // Format authors
  const authorsText = paper.authors && paper.authors.length > 0 
    ? paper.authors.length > 3 
      ? `${paper.authors.slice(0, 3).join(', ')} et al.`
      : paper.authors.join(', ')
    : '';

  // Group figures by type
  const tables = figures.filter(f => f.type === 'table');
  const figureItems = figures.filter(f => f.type === 'figure');
  const equations = figures.filter(f => f.type === 'equation');

  const paperContent = (
    <>
      <Helmet>
        <html lang="nl" />
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <link rel="canonical" href={canonical} />
        
        {/* Open Graph */}
        <meta property="og:type" content="article" />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:image" content={ogImage} />
        <meta property="og:url" content={canonical} />
        <meta property="og:site_name" content={defaults.siteName} />
        {paper.publication_date && <meta property="article:published_time" content={paper.publication_date} />}
        {paper.authors && paper.authors.map(author => (
          <meta key={author} property="article:author" content={author} />
        ))}
        
        {/* Twitter Cards */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />
        <meta name="twitter:image" content={ogImage} />
        
        {/* JSON-LD */}
        <script type="application/ld+json">
          {jsonLD}
        </script>
      </Helmet>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          {/* Left Share Toolbar - Desktop Only */}
          <div className="hidden lg:block lg:col-span-1">
            <ShareBar article={{
              id: paper.id,
              slug: paper.slug,
              title: paper.title,
              summary: paper.summary || ''
            } as any} />
          </div>

          {/* Main Paper Column */}
          <article className="lg:col-span-8">
            {/* Meta information */}
            <div className="text-xs text-muted-foreground mb-2 uppercase tracking-wide">
              Academic Paper{formattedDate && ` - ${formattedDate}`}
            </div>
            
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-serif leading-tight mb-3 lg:mb-4">
              {paper.title}
            </h1>

            {authorsText && (
              <div className="flex items-center gap-3 mb-4 text-sm text-muted-foreground">
                <span>Door {authorsText}</span>
              </div>
            )}

            {/* Mobile Share Bar */}
            <div className="lg:hidden mb-6">
              <ShareBar article={{
                id: paper.id,
                slug: paper.slug,
                title: paper.title,
                summary: paper.summary || ''
              } as any} mobile />
            </div>

            {/* Paper Icon - Smaller than article images */}
            {paper.cover_icon?.path && (
              <div className="mb-6">
                <div className="bg-muted border border-border rounded-lg p-4 flex justify-center">
                  <img
                    src={paper.cover_icon.path}
                    alt={paper.cover_icon.alt || paper.title}
                    className="max-h-32 w-auto rounded object-contain"
                  />
                </div>
              </div>
            )}
            
            <TripleDivider />

            {/* Paper Summary */}
            {paper.summary && (
              <div className="mb-8 p-6 bg-muted rounded-lg border border-border">
                <h2 className="font-semibold mb-3">Samenvatting</h2>
                <p className="text-foreground leading-relaxed">{paper.summary}</p>
              </div>
            )}

            {/* Paper Sections */}
            {sections.map((section) => (
              <div key={section.id} className="mb-8">
                {section.section_title && (
                  <h2 className="text-2xl font-bold font-serif mb-4">{section.section_title}</h2>
                )}
                {section.content && (
                  <div className="prose prose-lg max-w-none text-foreground leading-relaxed">
                    <div dangerouslySetInnerHTML={{ __html: section.content }} />
                  </div>
                )}
              </div>
            ))}

            {/* Figures and Tables */}
            {(tables.length > 0 || figureItems.length > 0 || equations.length > 0) && (
              <div className="mt-12">
                <h2 className="text-2xl font-bold font-serif mb-6">Bijlagen</h2>
                
                {/* Tables */}
                {tables.map((table) => (
                  <div key={table.id} className="mb-8 p-6 bg-muted rounded-lg border border-border">
                    {table.title && <h3 className="font-semibold mb-2">{table.title}</h3>}
                    {table.content && <div dangerouslySetInnerHTML={{ __html: table.content }} />}
                    {table.caption && <p className="text-sm text-muted-foreground mt-2">{table.caption}</p>}
                  </div>
                ))}

                {/* Figures */}
                {figureItems.map((figure) => (
                  <div key={figure.id} className="mb-8">
                    {figure.title && <h3 className="font-semibold mb-2">{figure.title}</h3>}
                    {figure.media_asset?.path && (
                      <div className="mb-4">
                        <img
                          src={figure.media_asset.path}
                          alt={figure.media_asset.alt || figure.title || ''}
                          className="max-w-full h-auto rounded border"
                        />
                      </div>
                    )}
                    {figure.content && <div dangerouslySetInnerHTML={{ __html: figure.content }} />}
                    {figure.caption && <p className="text-sm text-muted-foreground mt-2">{figure.caption}</p>}
                  </div>
                ))}

                {/* Equations */}
                {equations.map((equation) => (
                  <div key={equation.id} className="mb-8 p-4 bg-muted rounded border text-center">
                    {equation.title && <h3 className="font-semibold mb-2">{equation.title}</h3>}
                    {equation.content && <div dangerouslySetInnerHTML={{ __html: equation.content }} />}
                    {equation.caption && <p className="text-sm text-muted-foreground mt-2">{equation.caption}</p>}
                  </div>
                ))}
              </div>
            )}
          </article>

          {/* Right Sidebar */}
          <aside className="lg:col-span-3">
            <RightRailLatest articles={latestArticles} />
          </aside>
        </div>

        {/* Related Content and Comments */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 mt-12">
          <div className="lg:col-start-2 lg:col-span-8">
            <div className="mt-12">
              <ArticleComments articleId={paper.id} />
            </div>
          </div>
        </div>
      </div>
    </>
  );

  if (viewType === 'tablet') {
    return (
      <TabletAppShell viewType="tablet">
        {paperContent}
        <Toaster />
      </TabletAppShell>
    );
  }

  if (viewType === 'mobile') {
    return (
      <>
        <div className="min-h-screen bg-background" style={{ paddingBottom: 'calc(64px + env(safe-area-inset-bottom))' }}>
          <MobileHeader />
          <main>
            {paperContent}
          </main>
        </div>
        <BottomTabBar viewType="mobile" />
        <Toaster />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main>
        {paperContent}
      </main>

      <Footer />
      <Toaster />
    </div>
  );
}