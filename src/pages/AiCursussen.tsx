import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Heart } from 'lucide-react';
import { Header } from '@/components/Header';
import { MobileHeader } from '@/components/MobileHeader';
import { BottomTabBar } from '@/components/BottomTabBar';
import { Footer } from '@/components/Footer';
import { TabletAppShell } from '@/components/TabletAppShell';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function AiCursussen() {
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
        <title>AI Cursussen - AI Dagelijks</title>
        <meta name="description" content="Leer alles over Artificial Intelligence met onze praktische cursussen en trainingen." />
      </Helmet>
      
      <div className="container mx-auto px-4 md:px-6 lg:px-8 py-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-center">AI Cursussen</h1>
          <p className="text-lg text-muted-foreground mb-8 text-center">
            Praktische cursussen om AI te begrijpen en toe te passen
          </p>
          
          <Card className="border-dashed border-2">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 p-3 bg-primary/10 rounded-full w-fit">
                <Heart className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="text-xl">Binnenkort cursussen</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-muted-foreground">
                We werken hard aan een uitgebreid cursusaanbod over AI, van beginnersniveau tot gevorderde toepassingen voor professionals.
              </p>
              <p className="text-muted-foreground">
                Deze cursussen worden binnenkort gelanceerd.
              </p>
              <p className="text-sm text-muted-foreground">
                In de tussentijd kun je alle AI-nieuws vinden op onze{' '}
                <a href="/" className="text-primary hover:underline">homepage</a>.
              </p>
            </CardContent>
          </Card>
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