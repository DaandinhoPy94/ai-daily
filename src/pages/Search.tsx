import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useSearchParams } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { MobileHeader } from '@/components/MobileHeader';
import { BottomTabBar } from '@/components/BottomTabBar';
import { TabletAppShell } from '@/components/TabletAppShell';
import { SearchBar } from '@/components/SearchBar';
import { SearchResults } from '@/components/SearchResults';
import { searchArticles, SearchResult } from '@/lib/search';
import { getDefaultSEO, buildCanonical } from '@/lib/seo';

export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [viewType, setViewType] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<any>(null);
  const [searchType, setSearchType] = useState<string>('text');
  
  const query = searchParams.get('q') || '';

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

  const handleSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      setSearchParams({});
      return;
    }

    setIsLoading(true);
    setError(null);
    
    // Update URL with search query
    setSearchParams({ q: searchQuery });

    try {
      const { data, error: searchError, search_type } = await searchArticles(searchQuery, { limit: 50 });
      
      if (searchError) {
        throw searchError;
      }

      setResults(data);
      setSearchType(search_type || 'text');
    } catch (err) {
      console.error('Search error:', err);
      setError(err);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setResults([]);
    setSearchType('text');
    setSearchParams({});
  };

  // Search on page load if query exists
  useEffect(() => {
    if (query) {
      handleSearch(query);
    }
  }, []); // Only run on mount

  const defaults = getDefaultSEO();
  const pageTitle = query ? `Zoekresultaten voor "${query}"` : 'Zoeken';
  const pageDescription = query 
    ? `Zoekresultaten voor "${query}" in AI nieuws artikelen.`
    : 'Zoek door alle AI nieuws artikelen en vind de informatie die je zoekt.';
  const canonical = buildCanonical(query ? `/search?q=${encodeURIComponent(query)}` : '/search');

  const content = (
    <>
      <Helmet>
        <html lang="nl" />
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <link rel="canonical" href={canonical} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:url" content={canonical} />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />
        {query && <meta name="robots" content="noindex" />}
      </Helmet>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-2xl font-bold mb-4">Zoek in artikelen</h1>
            <SearchBar
              onSearch={handleSearch}
              onClear={handleClear}
              placeholder="Zoek naar artikelen over AI, technologie..."
              autoFocus={!query}
              className="w-full"
            />
          </div>

          <SearchResults
            results={results}
            isLoading={isLoading}
            error={error}
            query={query}
            searchType={searchType}
            className="min-h-[400px]"
          />
        </div>
      </div>
    </>
  );

  if (viewType === 'mobile' || viewType === 'tablet') {
    return (
      <TabletAppShell viewType={viewType} activeTab="Meer">
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