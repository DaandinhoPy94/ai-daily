import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Header } from '@/components/Header';
import { MobileHeader } from '@/components/MobileHeader';
import { BottomTabBar } from '@/components/BottomTabBar';
import { Footer } from '@/components/Footer';
import { TabletAppShell } from '@/components/TabletAppShell';
import { NewsCard } from '@/components/NewsCard';
import { gridArticles } from '@/data/mockData';

export default function ChipmakersInfrastructuur() {
  const [viewType, setViewType] = useState<'mobile' | 'tablet' | 'desktop'>('mobile');

  useEffect(() => {
    const updateViewType = () => {
      const width = window.innerWidth;
      if (width >= 1024) {
        setViewType('desktop');
      } else if (width >= 768) {
        setViewType('tablet');
      } else {
        setViewType('mobile');
      }
    };

    updateViewType();
    window.addEventListener('resize', updateViewType);
    return () => window.removeEventListener('resize', updateViewType);
  }, []);

  const content = (
    <main className="min-h-screen bg-background">
      <Helmet>
        <title>Chipmakers & AI Infrastructuur - AI Dagelijks</title>
        <meta name="description" content="Nieuws over AI-chips en infrastructuur van Nvidia, AMD, TSMC en andere chipmakers." />
      </Helmet>
      
      <div className="container mx-auto px-4 md:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Chipmakers & AI Infrastructuur</h1>
          <p className="text-lg text-muted-foreground mb-6">
            Blijf op de hoogte van ontwikkelingen bij chipmakers zoals Nvidia, AMD en TSMC, 
            en de infrastructuur die AI mogelijk maakt.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {gridArticles.slice(0, 9).map((article, index) => (
            <NewsCard 
              key={`${article.slug}-${index}`} 
              article={article} 
              variant="standard" 
            />
          ))}
        </div>
      </div>
    </main>
  );

  if (viewType === 'tablet') {
    return <TabletAppShell viewType={viewType}>{content}</TabletAppShell>;
  }

  return (
    <>
      {viewType === 'mobile' ? <MobileHeader /> : <Header />}
      {content}
      {viewType === 'mobile' ? <BottomTabBar /> : <Footer />}
    </>
  );
}