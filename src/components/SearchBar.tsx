import { useState, useEffect, useRef } from 'react';
import { Search, X, Clock } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { cn } from '@/lib/utils';
import { SearchSuggestions } from './SearchSuggestions';

interface SearchBarProps {
  onSearch: (query: string) => void;
  onClear?: () => void;
  placeholder?: string;
  className?: string;
  autoFocus?: boolean;
  showClearButton?: boolean;
  showSuggestions?: boolean;
  onSuggestionClick?: () => void;
}

export function SearchBar({ 
  onSearch, 
  onClear,
  placeholder = "Zoek in artikelen...", 
  className,
  autoFocus = false,
  showClearButton = true,
  showSuggestions = true,
  onSuggestionClick
}: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  useEffect(() => {
    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Don't search on empty query
    if (!query.trim()) {
      setIsTyping(false);
      if (onClear) onClear();
      return;
    }

    setIsTyping(true);

    // Debounce search with 300ms delay
    timeoutRef.current = setTimeout(() => {
      onSearch(query.trim());
      setIsTyping(false);
    }, 300);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [query, onSearch, onClear]);

  const handleClear = () => {
    setQuery('');
    if (onClear) onClear();
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      handleClear();
    }
  };

  return (
    <div className={cn("relative flex items-center", className)}>
      <div className="relative flex-1">
        <Search className={cn(
          "absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground transition-colors",
          isTyping && "text-primary"
        )} />
        <Input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="pl-10 pr-10 bg-background border-border focus:border-primary focus:ring-1 focus:ring-primary/20"
        />
        {query && showClearButton && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleClear}
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-muted/50"
            aria-label="Zoekopdracht wissen"
          >
            <X className="w-4 h-4" />
          </Button>
        )}
        
        {showSuggestions && query.trim() && (
          <SearchSuggestions 
            query={query}
            onResultClick={onSuggestionClick}
            maxResults={5}
          />
        )}
      </div>
      
      {isTyping && (
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
        </div>
      )}
    </div>
  );
}