import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Heart } from 'lucide-react';
import { Header } from '@/components/Header';
import { MobileHeader } from '@/components/MobileHeader';
import { BottomTabBar } from '@/components/BottomTabBar';
import { Footer } from '@/components/Footer';
import { TabletAppShell } from '@/components/TabletAppShell';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';

export default function LmArena() {
  const [viewType, setViewType] = useState<'mobile' | 'tablet' | 'desktop'>('mobile');
  const [scraperData, setScraperData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const { data, error } = await supabase.functions.invoke('lm-arena-scraper', {
          body: { name: 'Functions' },
        });
        
        if (error) {
          setError(error.message);
        } else {
          setScraperData(data);
        }
      } catch (err) {
        setError('Fout bij laden van leaderboard');
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  const content = (
    <main className="min-h-screen bg-background">
      <Helmet>
        <title>LM Arena - AI Dagelijks</title>
        <meta name="description" content="Vergelijk AI-modellen en bekijk prestaties in onze Language Model Arena." />
      </Helmet>
      
      <div className="container mx-auto px-4 md:px-6 lg:px-8 py-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-center">LM Arena</h1>
          <p className="text-lg text-muted-foreground mb-8 text-center">
            Vergelijk AI-modellen en ontdek welke het best presteren
          </p>
          
          <Card className="border-dashed border-2">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 p-3 bg-primary/10 rounded-full w-fit">
                <Heart className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="text-xl">Binnenkort arena</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              {loading && (
                <p className="text-muted-foreground">
                  Leaderboard wordt geladen...
                </p>
              )}
              
              {error && (
                <p className="text-destructive">
                  Fout bij laden: {error}
                </p>
              )}
              
              {scraperData && (
                <pre className="text-left text-sm overflow-auto max-h-96 p-4 bg-muted rounded">
                  {JSON.stringify(scraperData, null, 2)}
                </pre>
              )}
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