import { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { MobileHeader } from '@/components/MobileHeader';
import { BottomTabBar } from '@/components/BottomTabBar';
import { TabletAppShell } from '@/components/TabletAppShell';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Copy, ExternalLink, Rss } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const rssFeeds = [
  {
    title: 'Alle Artikelen',
    description: 'Volledige RSS feed met alle artikelen van AI Dagelijks',
    url: 'https://aidagelijks.nl/rss/all',
    category: 'Algemeen'
  },
  {
    title: 'Net Binnen',
    description: 'Laatste breaking news en belangrijke ontwikkelingen',
    url: 'https://aidagelijks.nl/rss/net-binnen',
    category: 'Nieuws'
  },
  {
    title: 'Research',
    description: 'Wetenschappelijke onderzoeken en AI research updates',
    url: 'https://aidagelijks.nl/rss/research',
    category: 'Research'
  },
  {
    title: 'Regelgeving',
    description: 'Nieuwe wetgeving en regelgeving rondom AI',
    url: 'https://aidagelijks.nl/rss/regelgeving',
    category: 'Beleid'
  },
  {
    title: 'VS Nieuws',
    description: 'AI ontwikkelingen uit de Verenigde Staten',
    url: 'https://aidagelijks.nl/rss/vs',
    category: 'Regio'
  },
  {
    title: 'Europa Nieuws',
    description: 'AI ontwikkelingen uit Europa',
    url: 'https://aidagelijks.nl/rss/europa',
    category: 'Regio'
  },
  {
    title: 'China Nieuws',
    description: 'AI ontwikkelingen uit China',
    url: 'https://aidagelijks.nl/rss/china',
    category: 'Regio'
  }
];

const categories = ['Alle', 'Algemeen', 'Nieuws', 'Research', 'Beleid', 'Regio'];

export default function RSSFeeds() {
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
  const { toast } = useToast();

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url);
    toast({
      title: "URL gekopieerd",
      description: "RSS feed URL is gekopieerd naar het klembord",
    });
  };

  const content = (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="space-y-8">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-2">
            <Rss className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">RSS Feeds</h1>
          </div>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Blijf op de hoogte van het laatste AI-nieuws via onze RSS feeds. 
            Voeg ze toe aan je favoriete RSS reader voor real-time updates.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {rssFeeds.map((feed, index) => (
            <Card key={index} className="relative">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg">{feed.title}</CardTitle>
                    <Badge variant="secondary" className="text-xs">
                      {feed.category}
                    </Badge>
                  </div>
                  <Rss className="h-5 w-5 text-muted-foreground" />
                </div>
                <CardDescription className="text-sm">
                  {feed.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-3">
                  <div className="p-2 bg-muted rounded text-xs font-mono break-all">
                    {feed.url}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(feed.url)}
                      className="flex-1"
                    >
                      <Copy className="mr-2 h-4 w-4" />
                      Kopiëren
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(feed.url, '_blank')}
                      className="flex-1"
                    >
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Openen
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Hoe gebruik je RSS?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="space-y-2">
                <p className="font-medium">1. Kies een RSS reader:</p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
                  <li>Feedly (web & mobiel)</li>
                  <li>Inoreader (web & mobiel)</li>
                  <li>NetNewsWire (Mac/iOS)</li>
                  <li>FeedReader (Windows)</li>
                </ul>
              </div>
              <div className="space-y-2">
                <p className="font-medium">2. Voeg de feed URL toe:</p>
                <p className="text-muted-foreground">
                  Kopieer de URL van een feed hierboven en plak deze in je RSS reader.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Over onze feeds</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="space-y-2">
                <p className="font-medium">📅 Update frequentie:</p>
                <p className="text-muted-foreground">
                  Feeds worden real-time bijgewerkt zodra nieuwe artikelen worden gepubliceerd.
                </p>
              </div>
              <div className="space-y-2">
                <p className="font-medium">📊 Inhoud:</p>
                <p className="text-muted-foreground">
                  Volledige artikeltekst en metadata zijn beschikbaar in alle feeds.
                </p>
              </div>
              <div className="space-y-2">
                <p className="font-medium">🔄 Formaat:</p>
                <p className="text-muted-foreground">
                  Alle feeds zijn beschikbaar in RSS 2.0 en Atom formaat.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );

  if (viewType === 'tablet') {
    return (
      <TabletAppShell viewType="tablet">
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

      {viewType === 'mobile' ? <BottomTabBar viewType="mobile" /> : <Footer />}
    </div>
  );
}