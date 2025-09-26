import { useState } from 'react';
import { Share2, Twitter, Facebook, Linkedin, Bookmark } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useBookmark } from '@/hooks/useBookmark';

interface ShareBarProps {
  article: {
    id: string;
    slug: string;
    title: string;
  };
  mobile?: boolean;
}

export function ShareBar({ article, mobile = false }: ShareBarProps) {
  const { toast } = useToast();
  const { isBookmarked, toggleBookmark } = useBookmark(article.id);
  const [isShareOpen, setIsShareOpen] = useState(false);

  const url = `${window.location.origin}/artikel/${article.slug}`;

  const openShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({ title: article.title, url });
        return;
      }
    } catch (err) {
      // ignore and fall back
    }
    setIsShareOpen(true);
  };

  const handleShare = async (type: string) => {
    const text = article.title;

    switch (type) {
      case 'native':
        await openShare();
        break;
      case 'copy':
        try {
          await navigator.clipboard.writeText(url);
          toast({
            description: "Link gekopieerd",
            duration: 2000,
          });
        } catch (err) {
          console.error('Failed to copy:', err);
        }
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank', 'noopener');
        break;
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank', 'noopener');
        break;
      case 'linkedin':
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank', 'noopener');
        break;
      case 'bookmark':
        await toggleBookmark();
        break;
    }
  };

  const shareButtons = [
    { type: 'native', icon: Share2, label: 'Deel' },
    { type: 'twitter', icon: Twitter, label: 'Deel op X' },
    { type: 'facebook', icon: Facebook, label: 'Deel op Facebook' },
    { type: 'linkedin', icon: Linkedin, label: 'Deel op LinkedIn' },
    { type: 'bookmark', icon: Bookmark, label: 'Bookmark', active: isBookmarked },
  ];

  if (mobile) {
    return (
      <>
        <div className="flex items-center justify-start gap-4 py-4 border-b border-border">
          {shareButtons.map(({ type, icon: Icon, label, active }) => (
            <button
              key={type}
              onClick={() => handleShare(type)}
              aria-label={label}
              className={`p-2 rounded-full transition-all duration-150 hover:scale-105 hover:bg-accent ${
                active ? 'text-primary bg-primary/10' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon size={20} />
            </button>
          ))}
        </div>

        {/* Fallback Share Sheet */}
        <Sheet open={isShareOpen} onOpenChange={setIsShareOpen}>
          <SheetContent side="bottom" className="p-4">
            <SheetHeader>
              <SheetTitle>Deel link</SheetTitle>
            </SheetHeader>
            <div className="mt-3 space-y-3">
              <Input readOnly value={url} className="text-sm" />
              <button
                onClick={() => handleShare('copy')}
                className="inline-flex h-10 w-full items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
              >
                Copy link
              </button>
            </div>
            <SheetFooter />
          </SheetContent>
        </Sheet>
      </>
    );
  }

  return (
    <>
      <div className="sticky top-24 space-y-4">
        {shareButtons.map(({ type, icon: Icon, label, active }) => (
          <button
            key={type}
            onClick={() => handleShare(type)}
            aria-label={label}
            className={`flex items-center justify-center w-10 h-10 rounded-full transition-all duration-150 hover:scale-105 hover:bg-accent ${
              active ? 'text-primary bg-primary/10' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Icon size={20} />
          </button>
        ))}
      </div>

      {/* Fallback Share Sheet */}
      <Sheet open={isShareOpen} onOpenChange={setIsShareOpen}>
        <SheetContent side="bottom" className="p-4">
          <SheetHeader>
            <SheetTitle>Deel link</SheetTitle>
          </SheetHeader>
          <div className="mt-3 space-y-3">
            <Input readOnly value={url} className="text-sm" />
            <button
              onClick={() => handleShare('copy')}
              className="inline-flex h-10 w-full items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
            >
              Copy link
            </button>
          </div>
          <SheetFooter />
        </SheetContent>
      </Sheet>
    </>
  );
}