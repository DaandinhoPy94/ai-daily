import { useState, useEffect, useRef, startTransition } from 'react';
import { useNavigate } from 'react-router-dom';
import { searchArticles, SearchResult, formatSearchDate } from '@/lib/search';
import { Clock, ExternalLink } from 'lucide-react';
import { Card } from './ui/card';

interface SearchSuggestionsProps {
  query: string;
  onResultClick?: () => void;
  maxResults?: number;
  className?: string;
}

export function SearchSuggestions({ 
  query, 
  onResultClick,
  maxResults = 5,
  className = ""
}: SearchSuggestionsProps) {
  const [suggestions, setSuggestions] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showMinimalLoader, setShowMinimalLoader] = useState(false);
  const navigate = useNavigate();
  const abortControllerRef = useRef<AbortController | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    // Clear timeouts
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Abort previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    if (!query.trim()) {
      startTransition(() => {
        setSuggestions([]);
        setIsLoading(false);
        setShowMinimalLoader(false);
      });
      return;
    }

    const searchForSuggestions = async () => {
      // Create new abort controller for this search
      const abortController = new AbortController();
      abortControllerRef.current = abortController;

      try {
        // Show minimal loader only if we don't have existing results or after a delay
        if (suggestions.length === 0) {
          setIsLoading(true);
        } else {
          // For subsequent searches, show subtle indicator
          timeoutRef.current = setTimeout(() => {
            if (!abortController.signal.aborted) {
              setShowMinimalLoader(true);
            }
          }, 150);
        }

        const { data } = await searchArticles(query, { limit: maxResults });
        
        if (!abortController.signal.aborted) {
          startTransition(() => {
            setSuggestions(data);
            setIsLoading(false);
            setShowMinimalLoader(false);
          });
        }
      } catch (error) {
        if (!abortController.signal.aborted) {
          console.error('Search suggestions error:', error);
          // Don't clear suggestions on error - keep previous results
          startTransition(() => {
            setIsLoading(false);
            setShowMinimalLoader(false);
          });
        }
      }
    };

    // Debounce search with shorter delay for mobile
    const timeoutId = setTimeout(searchForSuggestions, 250);
    timeoutRef.current = timeoutId;

    return () => {
      clearTimeout(timeoutId);
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [query, maxResults, suggestions.length]);

  const handleSuggestionClick = (suggestion: SearchResult) => {
    navigate(`/artikel/${suggestion.slug}`);
    if (onResultClick) onResultClick();
  };

  if (!query.trim()) {
    return null;
  }

  return (
    <div className={`absolute top-full left-0 right-0 z-50 mt-2 ${className}`}>
      <Card className="max-h-96 overflow-y-auto shadow-lg border-border bg-background">
        {/* Minimal loading indicator */}
        {(showMinimalLoader || (isLoading && suggestions.length === 0)) && (
          <div className="absolute top-2 right-2 z-10">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
          </div>
        )}
        
        {/* Show results or empty state - never completely hide content */}
        {isLoading && suggestions.length === 0 ? (
          <div className="p-4 text-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
            <p className="text-sm text-muted-foreground mt-2">Zoeken...</p>
          </div>
        ) : suggestions.length > 0 ? (
          <div className="py-2">
            {suggestions.map((suggestion) => (
              <div
                key={suggestion.id}
                onClick={() => handleSuggestionClick(suggestion)}
                className="px-4 py-3 hover:bg-muted/50 cursor-pointer border-b border-border last:border-b-0 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-foreground text-sm leading-tight line-clamp-2 mb-1">
                      {suggestion.title}
                    </h4>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                      <Clock className="w-3 h-3" />
                      <span>{suggestion.read_time_minutes} min</span>
                      <span>•</span>
                      <span>{formatSearchDate(suggestion.published_at)}</span>
                    </div>
                    {suggestion.snippet && (
                      <p 
                        className="text-xs text-muted-foreground line-clamp-2"
                        dangerouslySetInnerHTML={{ __html: suggestion.snippet }}
                      />
                    )}
                  </div>
                  <ExternalLink className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-4 text-center">
            <p className="text-sm text-muted-foreground">Geen resultaten gevonden voor "{query}"</p>
          </div>
        )}
      </Card>
    </div>
  );
}