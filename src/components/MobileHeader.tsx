import { useState } from 'react';
import { User, Search, X } from 'lucide-react';
import { Button } from './ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { AuthModal } from '@/components/auth/AuthModal';
import { AccountMenu } from '@/components/auth/AccountMenu';
import { SearchSuggestions } from './SearchSuggestions';

export function MobileHeader() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { user } = useAuth();

  const openSearch = () => setIsSearchOpen(true);
  const closeSearch = () => {
    setIsSearchOpen(false);
    setSearchQuery('');
  };

  return (
    <>
      {/* Main Header */}
      <header className="sticky top-0 z-50 bg-background border-b border-border h-14 flex items-center px-3">
        <div className="flex items-center justify-between w-full">
          {/* Left: Profile Icon */}
          {user ? (
            <AccountMenu />
          ) : (
            <Button
              variant="ghost"
              size="icon"
              className="w-9 h-9 rounded-full hover:bg-muted/50 transition-colors duration-150"
              aria-label="Profiel"
              onClick={() => setShowAuthModal(true)}
            >
              <User className="w-5 h-5 text-foreground" />
            </Button>
          )}

          {/* Center: Logo */}
          <h1 className="text-lg font-serif font-semibold text-foreground tracking-tight">
            AI Dagelijks
          </h1>

          {/* Right: Search Icon */}
          <Button
            variant="ghost"
            size="icon"
            className="w-9 h-9 rounded-full hover:bg-muted/50 transition-colors duration-150"
            aria-label="Zoeken"
            onClick={openSearch}
          >
            <Search className="w-5 h-5 text-foreground" />
          </Button>
        </div>
      </header>

      {/* Search Overlay */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-[60] bg-background">
          <div className="h-14 flex items-center px-3 border-b border-border">
            <div className="flex items-center w-full gap-3">
              <div className="flex-1 relative">
                <input
                  type="search"
                  placeholder="Zoeken..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent border-none outline-none text-foreground placeholder-muted-foreground text-base"
                  autoFocus
                />
                {searchQuery.trim() && (
                  <SearchSuggestions 
                    query={searchQuery}
                    onResultClick={closeSearch}
                    maxResults={10}
                    className="mt-1"
                  />
                )}
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="w-9 h-9 rounded-full hover:bg-muted/50 transition-colors duration-150"
                onClick={closeSearch}
                aria-label="Sluiten"
              >
                <X className="w-5 h-5 text-foreground" />
              </Button>
            </div>
          </div>
          <div className="p-4">
            <p className="text-muted-foreground text-sm">
              {searchQuery.trim() ? 'Zoekresultaten worden getoond...' : 'Begin met typen om te zoeken...'}
            </p>
          </div>
        </div>
      )}

      {/* Auth Modal */}
      <AuthModal
        open={showAuthModal}
        onOpenChange={setShowAuthModal}
      />
    </>
  );
}