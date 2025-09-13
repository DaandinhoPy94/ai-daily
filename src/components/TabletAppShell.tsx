import { ReactNode } from 'react';
import { MobileHeader } from './MobileHeader';
import { BottomTabBar } from './BottomTabBar';
import { useLocation } from 'react-router-dom';

interface TabletAppShellProps {
  children: ReactNode;
  activeTab?: string;
  viewType: 'mobile' | 'tablet';
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

/**
 * AppShell voor zowel mobile als tablet.
 * - Houdt header en footer vast (app-achtig gevoel).
 * - Corrigeert dubbele top-padding voor tablet (header + py-8 in pages).
 * - Adds extra bottom padding for fixed BottomTabBar on main topic slug routes.
 */
export function TabletAppShell({ children, activeTab, viewType }: TabletAppShellProps) {
  const location = useLocation();
  
  // Check if current route is a main topic slug
  const isMainTopicSlug = MAIN_TOPIC_SLUGS.includes(location.pathname.slice(1));
  
  // For main topic slugs, BottomTabBar is fixed, so we need more bottom padding
  const bottomPadding = isMainTopicSlug 
    ? 'calc(128px + env(safe-area-inset-bottom))' // Double padding for fixed positioning
    : 'calc(64px + env(safe-area-inset-bottom))';  // Normal padding for sticky positioning
  return (
    <div className="min-h-screen bg-background">
      <MobileHeader />
      <main style={{ 
        paddingTop: '56px', 
        paddingBottom: bottomPadding,
        marginTop: '-56px'
      }}>
        {children}
      </main>
      <BottomTabBar activeTab={activeTab} viewType={viewType} />
    </div>
  );
}
