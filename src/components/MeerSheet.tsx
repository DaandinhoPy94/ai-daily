import { useState } from 'react';
import { X, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { SearchBar } from '@/components/SearchBar';
import { SearchResults } from '@/components/SearchResults';
import { useNavigate } from 'react-router-dom';
import { searchArticles } from '@/lib/supabase';

interface MeerSheetProps {
  isOpen: boolean;
  onClose: () => void;
  viewType: 'mobile' | 'tablet';
}

const mainTopics = [
  { name: 'Onderzoek & Ontwikkeling', slug: 'onderzoek-ontwikkeling' },
  { name: 'Technologie & Modellen', slug: 'technologie-modellen' },
  { name: 'Toepassingen', slug: 'toepassingen' },
  { name: 'Bedrijven & Markt', slug: 'bedrijven-markt' },
  { name: 'Geografie & Politiek', slug: 'geografie-politiek' },
  { name: 'Veiligheid & Regelgeving', slug: 'veiligheid-regelgeving' },
  { name: 'Economie & Werk', slug: 'economie-werk' },
  { name: 'Cultuur & Samenleving', slug: 'cultuur-samenleving' }
];

export function MeerSheet({ isOpen, onClose, viewType }: MeerSheetProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<any>(null);
  const navigate = useNavigate();

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setSearchResults([]);
      setSearchError(null);
      return;
    }

    setIsSearching(true);
    setSearchError(null);
    try {
      const results = await searchArticles(query);
      setSearchResults(results.data || []);
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
      setSearchError(error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setSearchError(null);
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
              <div className="p-4">
                <SearchResults
                  results={searchResults}
                  isLoading={isSearching}
                  error={searchError}
                  query={searchQuery}
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
                   
                   {mainTopics.map((topic) => (
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
                   ))}
                 </div>
               </div>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}