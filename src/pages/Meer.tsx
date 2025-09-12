import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { MobileHeader } from '@/components/MobileHeader';
import { BottomTabBar } from '@/components/BottomTabBar';
import { TabletAppShell } from '@/components/TabletAppShell';
import { ChevronRight, Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const menuSections = [
  { title: 'Zoeken', href: '/search', icon: Search, description: 'Zoek door alle artikelen' },
  { title: 'Beurs', href: '/beurs' },
  { title: 'Podcasts', href: '/podcasts' },
  { title: 'FD Persoonlijk', href: '/fd-persoonlijk' },
  { title: 'Boeken', href: '/boeken' },
  { title: 'Economie', href: '/economie' },
  { title: 'Politiek', href: '/politiek' },
  { title: 'Bedrijfsleven', href: '/bedrijfsleven' },
  { title: 'Financiële markten', href: '/financiele-markten' },
  { title: 'Samenleving', href: '/samenleving' },
  { title: 'Tech & Innovatie', href: '/tech-innovatie' },
  { title: 'Opinie', href: '/opinie' },
];

export default function Meer() {
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

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const content = (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold mb-6">Meer</h1>
        
        <div className="space-y-1">
          {menuSections.map((section) => {
            const IconComponent = section.icon;
            return (
              <Link
                key={section.title}
                to={section.href}
                className="flex items-center justify-between p-4 hover:bg-muted/50 rounded-lg transition-colors"
              >
                <div className="flex items-center gap-3">
                  {IconComponent && <IconComponent className="h-5 w-5 text-muted-foreground" />}
                  <div>
                    <span className="text-foreground font-medium">{section.title}</span>
                    {section.description && (
                      <p className="text-sm text-muted-foreground">{section.description}</p>
                    )}
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );

  if (viewType === 'tablet') {
    return (
      <TabletAppShell viewType="tablet" activeTab="Meer">
        {content}
      </TabletAppShell>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {viewType === 'mobile' ? <MobileHeader /> : <Header />}
      
      <main>
        {content}
      </main>

      {viewType === 'mobile' ? <BottomTabBar activeTab="Meer" /> : <Footer />}
    </div>
  );
}