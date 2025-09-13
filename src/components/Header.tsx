import { useState, useEffect } from 'react';
import { Link, useSearchParams, useLocation } from 'react-router-dom';
import { Menu, Search, User, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { AuthModal } from '@/components/auth/AuthModal';
import { AccountMenu } from '@/components/auth/AccountMenu';
import { getMainTopics } from '@/lib/supabase';

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [mainTopics, setMainTopics] = useState<any[]>([]);
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const { user, preferences } = useAuth();

  // Load main topics
  useEffect(() => {
    const loadTopics = async () => {
      try {
        const topics = await getMainTopics();
        setMainTopics(topics || []);
      } catch (error) {
        console.error('Error loading main topics:', error);
      }
    };
    loadTopics();
  }, []);

  // Check for signin param on mount
  useEffect(() => {
    if (searchParams.get('signin') === '1' && !user) {
      setShowAuthModal(true);
    }
  }, [searchParams, user]);

  // Desktop navigation items (fixed structure)
  const desktopNavigationItems = [
    { name: 'Mijn nieuws', path: '/mijn-nieuws' },
    { name: 'Net binnen', path: '/net-binnen' },
    { name: 'Topics', path: '/topic' },
    { name: 'Nieuwsbrief', path: '/nieuwsbrief' },
    { name: 'AI Cursussen', path: '/ai-cursussen' },
    { name: 'Geabonneerd', path: '/geabonneerd' },
    { name: 'Profiel', path: '/profiel' }
  ];

  // Mobile navigation items (using main topics from database)
  const mobileNavigationItems = [
    { name: 'Mijn nieuws', path: '/mijn-nieuws' },
    { name: 'Net binnen', path: '/net-binnen' },
    ...mainTopics.map(topic => ({ 
      name: topic.name, 
      path: `/${topic.slug}` 
    }))
  ];


  return (
    <>
      <header className="sticky top-0 z-50 w-full bg-background border-b border-border">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left: Hamburger + Logo */}
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                className="md:hidden"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label="Menu"
              >
                <Menu className="h-5 w-5" />
              </Button>
              
              <Link to="/" className="text-xl font-bold font-serif hover:text-primary transition-colors">
                AI Dagelijks
              </Link>
            </div>

            {/* Center: Navigation (hidden on mobile) */}
            <nav className="hidden md:flex items-center space-x-1">
              {desktopNavigationItems.map((item) => {
                const isActive = location.pathname === item.path || 
                  (item.path === '/topic' && location.pathname.startsWith('/topic/')) ||
                  (item.path === '/nieuwsbrief' && location.pathname === '/nieuwsbrief') ||
                  (item.path === '/ai-cursussen' && location.pathname === '/ai-cursussen');
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`px-3 py-2 text-sm font-medium rounded-md transition-colors relative ${
                      isActive 
                        ? 'text-accent' 
                        : 'text-foreground hover:text-accent hover:bg-accent/5'
                    }`}
                    aria-current={isActive ? 'page' : undefined}
                    aria-label={`Ga naar ${item.name}`}
                  >
                    {item.name}
                    {isActive && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent rounded-full" />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Right: Subscribe + Profile + Search */}
            <div className="flex items-center gap-3">
              {preferences?.email_opt_in ? (
                <Button 
                  variant="secondary" 
                  size="sm"
                  className="btn-subscribe hidden sm:inline-flex opacity-70"
                >
                  Geabonneerd
                </Button>
              ) : (
                <Link to="/nieuwsbrief">
                  <Button className="btn-subscribe hidden sm:inline-flex">
                    Abonneren
                  </Button>
                </Link>
              )}
              
              {user ? (
                <AccountMenu />
              ) : (
                <Button
                  variant="ghost"
                  size="sm"
                  aria-label="Log in"
                  className="h-8 w-8 rounded-full"
                  onClick={() => setShowAuthModal(true)}
                >
                  <User className="h-5 w-5" />
                </Button>
              )}
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                aria-label="Search"
              >
                <Search className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        {isSearchOpen && (
          <div className="absolute top-full left-0 right-0 bg-background border-b border-border shadow-sm z-40">
            <div className="container mx-auto px-4 md:px-6 lg:px-8 py-4">
              <div className="flex items-center gap-3">
                <Search className="h-5 w-5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Zoek nieuws, bedrijven, onderwerpen..."
                  className="flex-1 bg-transparent border-none outline-none text-base"
                  autoFocus
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsSearchOpen(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div 
            className="absolute inset-0 bg-black/20" 
            onClick={() => setIsMobileMenuOpen(false)} 
          />
          <div className="absolute left-0 top-0 h-full w-80 max-w-[85vw] bg-background border-r border-border">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h2 className="font-semibold">Menu</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            
            <nav className="p-4">
              {mobileNavigationItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`block w-full text-left px-3 py-3 text-sm font-medium rounded-md transition-colors ${
                      isActive 
                        ? 'text-accent bg-accent/10' 
                        : 'hover:bg-hover-bg'
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    {item.name}
                  </Link>
                );
              })}
              
              <div className="mt-6 pt-6 border-t border-border">
                {preferences?.email_opt_in ? (
                  <Button 
                    variant="secondary" 
                    size="sm"
                    className="btn-subscribe w-full opacity-70"
                  >
                    Geabonneerd
                  </Button>
                ) : (
                  <Link to="/nieuwsbrief">
                    <Button className="btn-subscribe w-full">
                      Abonneren
                    </Button>
                  </Link>
                )}
              </div>
            </nav>
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