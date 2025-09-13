import { useState } from 'react';
import { X, Folder } from 'lucide-react';
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

  const handleTopicClick = (slug: string) => {
    navigate(`/${slug}`);
    onClose();
  };

  const handleSearchResultClick = () => {
    onClose();
  };

  const gridCols = viewType === 'mobile' ? 'grid-cols-2' : 'grid-cols-3';

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
              /* Topics Grid */
              <div className="p-4">
                <h3 className="text-sm font-medium text-muted-foreground mb-4 uppercase tracking-wide">
                  Hoofdonderwerpen
                </h3>
                <div className={`grid ${gridCols} gap-3`}>
                  {mainTopics.map((topic) => (
                    <button
                      key={topic.slug}
                      onClick={() => handleTopicClick(topic.slug)}
                      className="flex flex-col items-center p-4 bg-card border border-border rounded-lg hover:bg-accent/10 active:bg-accent/20 transition-colors"
                    >
                      <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center mb-3">
                        <Folder className="w-6 h-6 text-muted-foreground" />
                      </div>
                      <span className="text-sm font-medium text-center leading-tight">
                        {topic.name}
                      </span>
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