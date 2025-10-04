import { useState } from 'react';
import { User, Share2, Bookmark } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useBookmark } from '@/hooks/useBookmark';
import { useAuth } from '@/contexts/AuthContext';
import { AuthModal } from '@/components/auth/AuthModal';
import { AccountMenu } from '@/components/auth/AccountMenu';

type MobileHeaderArticleProps = {
  articleId?: string;
};

export function MobileHeaderArticle({ articleId: _articleId }: MobileHeaderArticleProps) {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { isBookmarked, toggleBookmark } = useBookmark(_articleId);
  const [isShareOpen, setIsShareOpen] = useState(false);

  const { user } = useAuth();

  const { toast } = useToast();

  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({ title: document.title, url: shareUrl });
        return;
      }
    } catch (err) {
      // Ignore AbortError; fall through to fallback sheet for other cases
    }
    setIsShareOpen(true);
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast({ description: 'Link gekopieerd', duration: 2000 });
      setIsShareOpen(false);
    } catch (_) {}
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

          {/* Right: Bookmark + Share */}
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="w-9 h-9 rounded-full hover:bg-muted/50 transition-colors duration-150"
              aria-label={isBookmarked ? 'Verwijder bookmark' : 'Voeg bookmark toe'}
              onClick={toggleBookmark}
            >
              <Bookmark 
                className={`w-5 h-5 transition-colors ${isBookmarked ? 'text-orange-500' : 'text-foreground'}`} 
                fill={isBookmarked ? 'currentColor' : 'none'} 
              />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="w-9 h-9 rounded-full hover:bg-muted/50 transition-colors duration-150"
              aria-label="Deel"
              onClick={handleShare}
            >
              <Share2 className="w-5 h-5 text-foreground" />
            </Button>
          </div>
        </div>
      </header>

      {/* Auth Modal */}
      <AuthModal open={showAuthModal} onOpenChange={setShowAuthModal} />

      {/* Fallback Share Sheet */}
      <Sheet open={isShareOpen} onOpenChange={setIsShareOpen}>
        <SheetContent side="bottom" className="p-4">
          <SheetHeader>
            <SheetTitle>Deel link</SheetTitle>
          </SheetHeader>
          <div className="mt-3 space-y-3">
            <Input readOnly value={shareUrl} className="text-sm" />
            <Button onClick={handleCopyLink} className="w-full">Copy link</Button>
          </div>
          <SheetFooter />
        </SheetContent>
      </Sheet>
    </>
  );
}


