import { ReactNode } from 'react';
import { MobileHeader } from './MobileHeader';
import { BottomTabBar } from './BottomTabBar';

interface TabletAppShellProps {
  children: ReactNode;
  activeTab?: string;
  viewType: 'mobile' | 'tablet';
}

/**
 * AppShell voor zowel mobile als tablet.
 * - Houdt header en footer vast (app-achtig gevoel).
 * - Corrigeert dubbele top-padding voor tablet (header + py-8 in pages).
 */
export function TabletAppShell({ children, activeTab, viewType }: TabletAppShellProps) {
  return (
    <div className="min-h-screen bg-background">
      <MobileHeader />
      <main style={{ 
        paddingTop: '56px', 
        paddingBottom: 'calc(64px + env(safe-area-inset-bottom))',
        marginTop: '-56px'
      }}>
        {children}
      </main>
      <BottomTabBar activeTab={activeTab} />
    </div>
  );
}
