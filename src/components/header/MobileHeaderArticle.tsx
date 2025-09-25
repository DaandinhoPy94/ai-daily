import { useState } from 'react';
import { User, Share2, Bookmark } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { AuthModal } from '@/components/auth/AuthModal';
import { AccountMenu } from '@/components/auth/AccountMenu';

export function MobileHeaderArticle() {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  const { user } = useAuth();

  const toggleBookmark = () => setIsBookmarked((prev) => !prev);

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

          {/* Right: Bookmark + Share */}
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="w-9 h-9 rounded-full hover:bg-muted/50 transition-colors duration-150"
              aria-label={isBookmarked ? 'Verwijder bookmark' : 'Voeg bookmark toe'}
              onClick={toggleBookmark}
            >
              <Bookmark className="w-5 h-5 text-foreground" fill={isBookmarked ? 'currentColor' : 'none'} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="w-9 h-9 rounded-full hover:bg-muted/50 transition-colors duration-150"
              aria-label="Deel"
              onClick={() => {
                // Use Web Share API if available, otherwise no-op; ShareBar handles deep share flows
                if (navigator.share) {
                  navigator.share({ title: document.title, url: window.location.href }).catch(() => {});
                }
              }}
            >
              <Share2 className="w-5 h-5 text-foreground" />
            </Button>
          </div>
        </div>
      </header>

      {/* Auth Modal */}
      <AuthModal open={showAuthModal} onOpenChange={setShowAuthModal} />
    </>
  );
}


