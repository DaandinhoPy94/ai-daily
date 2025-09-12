import { useEffect, useState } from 'react';
import Index from './Index';
import MobileIndex from './MobileIndex';
import { TabletAppShell } from '@/components/TabletAppShell';

export default function ResponsiveIndex() {
  const [viewType, setViewType] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');

  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      if (width < 768) {
        setViewType('mobile');
      } else if (width >= 768 && width <= 1024) {
        setViewType('tablet');
      } else {
        setViewType('desktop');
      }
    };

    // Check initial screen size
    checkScreenSize();

    // Listen for resize events
    window.addEventListener('resize', checkScreenSize);

    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Render based on screen size
  if (viewType === 'mobile') {
    return <MobileIndex />;
  } else if (viewType === 'tablet') {
    return (
      <TabletAppShell viewType="tablet" activeTab="Voorpagina">
        <MobileIndex isWrappedInAppShell={true} />
      </TabletAppShell>
    );
  } else {
    return <Index />;
  }
}