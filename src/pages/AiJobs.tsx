import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Heart } from 'lucide-react';
import { Header } from '@/components/Header';
import { MobileHeader } from '@/components/MobileHeader';
import { BottomTabBar } from '@/components/BottomTabBar';
import { Footer } from '@/components/Footer';
import { TabletAppShell } from '@/components/TabletAppShell';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function AiJobs() {
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
        <title>AI Jobs - AI Dagelijks</title>
        <meta name="description" content="Vind de beste AI-vacatures en bouw je carrière in de kunstmatige intelligentie sector." />
      </Helmet>
      
      <div className="container mx-auto px-4 md:px-6 lg:px-8 py-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-center">AI Jobs</h1>
          <p className="text-lg text-muted-foreground mb-8 text-center">
            Ontdek carrièremogelijkheden in de AI-sector
          </p>
          
          <Card className="border-dashed border-2">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 p-3 bg-primary/10 rounded-full w-fit">
                <Heart className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="text-xl">Binnenkort vacatures</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-muted-foreground">
                We werken hard aan een jobboard met de nieuwste AI-vacatures, van machine learning engineers tot AI-consultants.
              </p>
              <p className="text-muted-foreground">
                Deze functie wordt binnenkort gelanceerd.
              </p>
              <p className="text-sm text-muted-foreground">
                In de tussentijd kun je alle AI-nieuws vinden op onze homepage.
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