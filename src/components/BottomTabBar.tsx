import { useState } from 'react';
import { Home, Clock, Heart, Zap, MoreHorizontal } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { MeerSheet } from '@/components/MeerSheet';

interface BottomTabBarProps {
  activeTab?: string;
  viewType?: 'mobile' | 'tablet' | 'desktop';
}

// Main topic slugs that should have fixed bottom navigation
const MAIN_TOPIC_SLUGS = [
  'onderzoek-ontwikkeling',
  'technologie-modellen', 
  'toepassingen',
  'bedrijven-markt',
  'geografie-politiek',
  'veiligheid-regelgeving',
  'economie-werk',
  'cultuur-samenleving'
];

export function BottomTabBar({ activeTab = 'Voorpagina', viewType = 'mobile' }: BottomTabBarProps) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showMeerSheet, setShowMeerSheet] = useState(false);

  // Check if current route is a main topic slug
  const isMainTopicSlug = MAIN_TOPIC_SLUGS.includes(location.pathname.slice(1));
  
  // Use fixed positioning on tablet/mobile for main topic slug routes
  const shouldBeFixed = isMainTopicSlug && (viewType === 'mobile' || viewType === 'tablet');

  const tabs = [
    { id: 'Voorpagina', label: 'Voorpagina', icon: Home, href: '/' },
    { id: 'NetBinnen', label: 'Net binnen', icon: Clock, href: '/net-binnen' },
    { id: 'MijnNieuws', label: 'Mijn nieuws', icon: Heart, href: '/mijn-nieuws', requiresAuth: true },
    { id: 'Meer', label: 'Meer', icon: MoreHorizontal, href: '/meer' },
  ];

  const handleTabClick = (tab: typeof tabs[0]) => {
    if (tab.requiresAuth && !user) {
      // Show auth modal or redirect to login - for now just ignore the click
      return;
    }

    // For "Meer" tab on mobile/tablet, show sheet instead of navigation
    if (tab.id === 'Meer' && (viewType === 'mobile' || viewType === 'tablet')) {
      setShowMeerSheet(true);
      return;
    }

    navigate(tab.href);
  };

  return (
    <>
      <nav 
        className={`fixed bottom-0 left-0 right-0 w-screen bg-background border-t border-border px-2 z-50`}
        style={{
          paddingBottom: 'env(safe-area-inset-bottom)',
          height: 'calc(64px + env(safe-area-inset-bottom))'
        }}
      >
        <div className="flex items-start justify-around pt-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = tab.id === activeTab;
            
            return (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab)}
                className={`flex flex-col items-center min-w-[44px] min-h-[44px] px-1 py-1 rounded-lg transition-colors duration-150 hover:bg-muted/50 active:bg-muted ${
                  isActive ? 'relative' : ''
                }`}
                aria-label={tab.label}
              >
                {/* Active indicator */}
                {isActive && (
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-8 h-0.5 bg-accent rounded-full" />
                )}
                
                <Icon 
                  className={`w-6 h-6 mb-1 transition-colors ${
                    isActive ? 'text-accent' : 'text-foreground'
                  }`} 
                />
                <span 
                  className={`text-xs leading-tight transition-colors ${
                    isActive ? 'text-accent' : 'text-foreground'
                  }`}
                >
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
      
      {/* Meer Sheet for mobile/tablet */}
      {(viewType === 'mobile' || viewType === 'tablet') && (
        <MeerSheet 
          isOpen={showMeerSheet}
          onClose={() => setShowMeerSheet(false)}
          viewType={viewType}
        />
      )}
    </>
  );
}