import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Header } from '@/components/Header';
import { MobileHeader } from '@/components/MobileHeader';
import { BottomTabBar } from '@/components/BottomTabBar';
import { Footer } from '@/components/Footer';
import { TabletAppShell } from '@/components/TabletAppShell';
import { NewsCard } from '@/components/NewsCard';
import { gridArticles } from '@/data/mockData';

export default function TextToSpeechSpeechToText() {
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
        <title>Text-to-Speech & Speech-to-Text - AI Dagelijks</title>
        <meta name="description" content="Ontwikkelingen in AI spraaktechnologie, van tekst naar spraak en omgekeerd." />
      </Helmet>
      
      <div className="container mx-auto px-4 md:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Text-to-Speech & Speech-to-Text</h1>
          <p className="text-lg text-muted-foreground mb-6">
            Blijf op de hoogte van de nieuwste ontwikkelingen in AI spraaktechnologie, 
            van tekst-naar-spraak conversie tot spraakherkenning en voice assistenten.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {gridArticles.slice(1, 7).map((article, index) => (
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