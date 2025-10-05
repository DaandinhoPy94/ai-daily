import { useState, useRef, startTransition, useEffect } from 'react';
import { X, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { SearchBar } from '@/components/SearchBar';
import { SearchResults } from '@/components/SearchResults';
import { useNavigate } from 'react-router-dom';
import { searchArticles } from '@/lib/search';
import { getMainTopics } from '@/lib/supabase';

interface MeerSheetProps {
  isOpen: boolean;
  onClose: () => void;
  viewType: 'mobile' | 'tablet';
}

interface Topic {
  id: string;
  name: string;
  slug: string;
}

export function MeerSheet({ isOpen, onClose, viewType }: MeerSheetProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<any>(null);
  const [showMinimalLoader, setShowMinimalLoader] = useState(false);
  const [mainTopics, setMainTopics] = useState<Topic[]>([]);
  const [topicsLoading, setTopicsLoading] = useState(true);
  const navigate = useNavigate();
  const abortControllerRef = useRef<AbortController | null>(null);

  // Load topics from database
  useEffect(() => {
    const loadTopics = async () => {
      try {
        setTopicsLoading(true);
        const topics = await getMainTopics();
        setMainTopics(topics || []);
      } catch (error) {
        console.error('Error loading topics:', error);
      } finally {
        setTopicsLoading(false);
      }
    };
    loadTopics();
  }, []);

  const handleSearch = async (query: string) => {
    // Abort previous search
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    startTransition(() => {
      setSearchQuery(query);
    });

    if (!query.trim()) {
      startTransition(() => {
        setSearchResults([]);
        setSearchError(null);
        setIsSearching(false);
        setShowMinimalLoader(false);
      });
      return;
    }

    // Create new abort controller
    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    try {
      // For mobile, show minimal loader to avoid flicker
      if (searchResults.length === 0) {
        setIsSearching(true);
      } else {
        setShowMinimalLoader(true);
      }
      
      setSearchError(null);

      const results = await searchArticles(query, { limit: 20 });
      
      if (!abortController.signal.aborted) {
        startTransition(() => {
          setSearchResults(results.data || []);
          setIsSearching(false);
          setShowMinimalLoader(false);
        });
      }
    } catch (error) {
      if (!abortController.signal.aborted) {
        console.error('Search error:', error);
        // Don't clear results on error to prevent flicker
        startTransition(() => {
          setSearchError(error);
          setIsSearching(false);
          setShowMinimalLoader(false);
        });
      }
    }
  };

  const handleClearSearch = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    startTransition(() => {
      setSearchQuery('');
      setSearchResults([]);
      setSearchError(null);
      setIsSearching(false);
      setShowMinimalLoader(false);
    });
  };

  const handleTopicClick = (topicSlug: string) => {
    const path = topicSlug.startsWith('/') ? topicSlug : `/${topicSlug}`;
    navigate(path);
    onClose();
  };

  const handleSearchResultClick = () => {
    onClose();
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent 
        side="bottom" 
        className="h-full w-full rounded-t-none border-t-0 p-0"
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <SheetHeader className="flex-row items-center justify-between p-4 pb-2 border-b border-border">
            <SheetTitle className="text-lg font-semibold">Meer</SheetTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0"
              aria-label="Sluiten"
            >
              <X className="h-4 w-4" />
            </Button>
          </SheetHeader>

          {/* Search Bar */}
          <div className="p-4 pb-2 border-b border-border">
            <SearchBar
              onSearch={handleSearch}
              onClear={handleClearSearch}
              placeholder="Zoek in artikelen..."
              autoFocus={false}
              showSuggestions={false}
            />
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            {searchQuery.trim() ? (
              /* Search Results */
              <div className="p-4 relative">
                {/* Minimal loading indicator */}
                {showMinimalLoader && (
                  <div className="absolute top-2 right-2 z-10">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                  </div>
                )}
                <SearchResults
                  results={searchResults}
                  isLoading={isSearching}
                  error={searchError}
                  query={searchQuery}
                  searchType="text"
                  onResultClick={handleSearchResultClick}
                />
              </div>
            ) : (
               /* Topics List */
               <div className="p-4">
                 <div className="space-y-1">
                   {/* Alle onderwerpen link */}
                   <button
                     onClick={() => handleTopicClick('/topic')}
                     className="flex items-center justify-between w-full p-4 hover:bg-muted/50 rounded-lg transition-colors text-left"
                   >
                     <div>
                       <span className="text-foreground font-medium">Alle onderwerpen</span>
                     </div>
                     <ChevronRight className="h-5 w-5 text-muted-foreground" />
                   </button>
                   
                   {/* Loading state */}
                   {topicsLoading ? (
                     <>
                       {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                         <div key={i} className="flex items-center justify-between w-full p-4">
                           <div className="h-5 w-48 bg-muted rounded animate-pulse"></div>
                           <div className="h-5 w-5 bg-muted rounded animate-pulse"></div>
                         </div>
                       ))}
                     </>
                   ) : (
                     /* Main Topics from database */
                     mainTopics.map((topic) => (
                       <button
                         key={topic.slug}
                         onClick={() => handleTopicClick(topic.slug)}
                         className="flex items-center justify-between w-full p-4 hover:bg-muted/50 rounded-lg transition-colors text-left"
                       >
                         <div>
                           <span className="text-foreground font-medium">{topic.name}</span>
                         </div>
                         <ChevronRight className="h-5 w-5 text-muted-foreground" />
                       </button>
                     ))
                   )}
                 </div>
               </div>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
