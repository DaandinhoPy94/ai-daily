import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Clock, ExternalLink } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { cn } from '@/lib/utils';
import { SearchResult, formatSearchDate, parseSnippet, getSearchTypeLabel } from '@/lib/search';

interface SearchResultsProps {
  results: SearchResult[];
  isLoading: boolean;
  error: any;
  query: string;
  searchType?: string;
  onResultClick?: (result: SearchResult) => void;
  className?: string;
}

export function SearchResults({ 
  results, 
  isLoading, 
  error, 
  query,
  searchType = 'text',
  onResultClick,
  className 
}: SearchResultsProps) {
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [hoveredIndex, setHoveredIndex] = useState(-1);
  const resultsRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLElement | null)[]>([]);

  // Reset selection when results change
  useEffect(() => {
    setSelectedIndex(-1);
    setHoveredIndex(-1);
    itemRefs.current = itemRefs.current.slice(0, results.length);
  }, [results]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!results.length) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex(prev => {
            const newIndex = prev < results.length - 1 ? prev + 1 : 0;
            scrollToItem(newIndex);
            return newIndex;
          });
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex(prev => {
            const newIndex = prev > 0 ? prev - 1 : results.length - 1;
            scrollToItem(newIndex);
            return newIndex;
          });
          break;
        case 'Enter':
          e.preventDefault();
          if (selectedIndex >= 0 && selectedIndex < results.length) {
            const result = results[selectedIndex];
            if (onResultClick) {
              onResultClick(result);
            } else {
              window.location.href = `/artikel/${result.slug}`;
            }
          }
          break;
        case 'Escape':
          setSelectedIndex(-1);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [results, selectedIndex, onResultClick]);

  const scrollToItem = useCallback((index: number) => {
    const item = itemRefs.current[index];
    if (item && resultsRef.current) {
      const container = resultsRef.current;
      const itemTop = item.offsetTop;
      const itemBottom = itemTop + item.offsetHeight;
      const containerTop = container.scrollTop;
      const containerBottom = containerTop + container.offsetHeight;

      if (itemTop < containerTop) {
        container.scrollTop = itemTop;
      } else if (itemBottom > containerBottom) {
        container.scrollTop = itemBottom - container.offsetHeight;
      }
    }
  }, []);

  if (isLoading) {
    return (
      <div className={cn("space-y-4", className)}>
        {Array.from({ length: 3 }, (_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-4">
              <div className="space-y-2">
                <div className="h-4 bg-muted rounded w-3/4"></div>
                <div className="h-3 bg-muted rounded w-1/2"></div>
                <div className="h-3 bg-muted rounded w-full"></div>
                <div className="h-3 bg-muted rounded w-5/6"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className={cn("text-center py-8", className)}>
        <p className="text-destructive mb-2">Er ging iets mis bij het zoeken</p>
        <p className="text-sm text-muted-foreground">
          Probeer het opnieuw of gebruik andere zoektermen
        </p>
      </div>
    );
  }

  if (!query.trim()) {
    return (
      <div className={cn("text-center py-8 text-muted-foreground", className)}>
        <p>Voer een zoekterm in om artikelen te vinden</p>
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className={cn("text-center py-8", className)}>
        <p className="text-foreground mb-2">Geen resultaten gevonden voor "{query}"</p>
        <p className="text-sm text-muted-foreground">
          Probeer andere zoektermen of controleer de spelling
        </p>
      </div>
    );
  }

  return (
    <div className={cn("space-y-4", className)} ref={resultsRef}>
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-muted-foreground">
          {results.length} resultaat{results.length === 1 ? '' : 'en'} voor "{query}"
        </p>
        <Badge variant="outline" className="text-xs">
          {getSearchTypeLabel(searchType)}
        </Badge>
      </div>

      {results.map((result, index) => {
        const isSelected = index === selectedIndex;
        const isHovered = index === hoveredIndex;
        
        return (
          <Card 
            key={result.id}
            ref={el => itemRefs.current[index] = el}
            className={cn(
              "transition-all duration-150 hover:shadow-md cursor-pointer",
              (isSelected || isHovered) && "ring-2 ring-primary/20 shadow-md"
            )}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(-1)}
            onClick={() => {
              if (onResultClick) {
                onResultClick(result);
              }
            }}
          >
            <CardContent className="p-4">
              <Link 
                to={`/artikel/${result.slug}`}
                className="block space-y-3 text-inherit no-underline"
                onClick={(e) => {
                  if (onResultClick) {
                    e.preventDefault();
                    onResultClick(result);
                  }
                }}
              >
                <div className="space-y-2">
                  <h3 className="font-semibold text-lg leading-tight line-clamp-2 hover:text-primary transition-colors">
                    {result.title}
                  </h3>
                  
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{result.read_time_minutes} min</span>
                    </div>
                    <span>•</span>
                    <span>{formatSearchDate(result.published_at)}</span>
                    {result.combined_rank && (
                      <>
                        <Badge variant="secondary" className="text-xs">
                          Score: {Math.round(result.combined_rank * 100)}
                        </Badge>
                      </>
                    )}
                    {result.search_type && result.search_type !== 'text' && (
                      <Badge variant="default" className="text-xs bg-primary/10 text-primary border-primary/20">
                        {getSearchTypeLabel(result.search_type)}
                      </Badge>
                    )}
                  </div>
                </div>

                <div 
                  className="text-sm text-muted-foreground leading-relaxed"
                  dangerouslySetInnerHTML={{ 
                    __html: parseSnippet(result.snippet) 
                  }}
                />

                <div className="flex items-center text-xs text-primary hover:text-primary/80">
                  <span>Lees meer</span>
                  <ExternalLink className="w-3 h-3 ml-1" />
                </div>
              </Link>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}