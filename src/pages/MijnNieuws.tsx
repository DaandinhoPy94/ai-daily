import { useAuth } from '@/contexts/AuthContext';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { MobileHeader } from '@/components/MobileHeader';
import { BottomTabBar } from '@/components/BottomTabBar';
import { TabletAppShell } from '@/components/TabletAppShell';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function MijnNieuws() {
  const [viewType, setViewType] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');
  const { user, profile, loading } = useAuth();

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

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><p>Bezig met laden…</p></div>;
  }
  if (!user) {
    return <div className="min-h-screen flex items-center justify-center"><p>Je moet ingelogd zijn om je mijn nieuws te bekijken.</p></div>;
  }
  if (!profile) {
    return <div className="min-h-screen flex items-center justify-center"><p>Je profiel wordt ingesteld…</p></div>;
  }

  const content = (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Mijn nieuws</h1>
          <p className="text-muted-foreground">
            Gepersonaliseerd AI-nieuws op basis van jouw interesses.
          </p>
        </div>

        <Card className="text-center py-12">
          <CardHeader>
            <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <Heart className="h-6 w-6 text-primary" />
            </div>
            <CardTitle>Binnenkort beschikbaar</CardTitle>
            <CardDescription className="max-w-md mx-auto">
              We werken hard aan een gepersonaliseerde nieuwsfeed die perfect aansluit 
              bij jouw AI-interesses. Deze functie wordt binnenkort gelanceerd.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              In de tussentijd kun je alle AI-nieuws vinden op onze{' '}
              <a href="/" className="text-primary hover:underline">
                homepage
              </a>
              .
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  if (viewType === 'tablet') {
    return (
      <TabletAppShell viewType="tablet" activeTab="MijnNieuws">
        {content}
      </TabletAppShell>
    );
  }

  if (viewType === 'mobile') {
    return (
      <>
        <div className="min-h-screen bg-background" style={{ paddingBottom: 'calc(64px + env(safe-area-inset-bottom))' }}>
          <MobileHeader />
          <main>
            {content}
          </main>
        </div>
        <BottomTabBar activeTab="MijnNieuws" viewType="mobile" />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main>
        {content}
      </main>

      <Footer />
    </div>
  );
}