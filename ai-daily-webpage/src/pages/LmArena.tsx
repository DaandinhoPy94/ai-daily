import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Header } from '@/components/Header';
import { MobileHeader } from '@/components/MobileHeader';
import { BottomTabBar } from '@/components/BottomTabBar';
import { Footer } from '@/components/Footer';
import { TabletAppShell } from '@/components/TabletAppShell';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { supabase } from '@/integrations/supabase/client';

interface LeaderboardEntry {
  rank_position: number | null;
  model_name: string;
  organization: string | null;
  overall_score: number | null;
  votes: number | null;
  arena: string | null;
}

const arenaCategories = [
  { key: 'overview', label: 'Overview' },
  { key: 'text', label: 'Text' },
  { key: 'webdev', label: 'WebDev' },
  { key: 'vision', label: 'Vision' },
  { key: 'text-to-image', label: 'Text-to-Image' },
  { key: 'image-edit', label: 'Image Edit' },
  { key: 'search', label: 'Search' },
  { key: 'text-to-video', label: 'Text-to-Video' },
  { key: 'image-to-video', label: 'Image-to-Video' },
  { key: 'copilot', label: 'Copilot' }
];

export default function LmArena() {
  const [viewType, setViewType] = useState<'mobile' | 'tablet' | 'desktop'>('mobile');
  const [activeTab, setActiveTab] = useState('overview');
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([]);
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
        setLoading(true);
        // Use raw query since table might not be in TypeScript types
        let query = (supabase as any)
          .from('lm_arena_leaderboard_snapshots')
          .select('rank_position, model_name, organization, overall_score, votes, arena')
          .order('rank_position', { ascending: true });

        if (activeTab !== 'overview') {
          query = query.eq('arena', activeTab);
        }

        const { data, error } = await query;
        
        if (error) {
          setError(error.message);
        } else {
          setLeaderboardData((data as LeaderboardEntry[]) || []);
          setError(null);
        }
      } catch (err) {
        setError('Fout bij laden van leaderboard');
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, [activeTab]);

  const content = (
    <main className="min-h-screen bg-background">
      <Helmet>
        <title>LM Arena - AI Dagelijks</title>
        <meta name="description" content="Vergelijk AI-modellen en bekijk prestaties in onze Language Model Arena." />
      </Helmet>
      
      <div className="container mx-auto px-4 md:px-6 lg:px-8 py-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-center">LM Arena</h1>
          <p className="text-lg text-muted-foreground mb-8 text-center">
            Vergelijk AI-modellen en ontdek welke het best presteren
          </p>
          
          <Card className="shadow-lg border-0 bg-card/50 backdrop-blur-sm">
            <CardContent className="p-6">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                <TabsList className="grid grid-cols-5 lg:grid-cols-10 w-full bg-muted/50 p-1 rounded-2xl">
                  {arenaCategories.map((category) => (
                    <TabsTrigger
                      key={category.key}
                      value={category.key}
                      className="text-sm font-medium transition-all duration-200 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-xl"
                    >
                      {category.label}
                    </TabsTrigger>
                  ))}
                </TabsList>

                {arenaCategories.map((category) => (
                  <TabsContent key={category.key} value={category.key} className="space-y-4">
                    {loading ? (
                      <div className="space-y-3">
                        {[...Array(10)].map((_, i) => (
                          <div key={i} className="flex items-center space-x-4 p-3">
                            <Skeleton className="h-6 w-8" />
                            <Skeleton className="h-6 w-48" />
                            <Skeleton className="h-6 w-16" />
                            <Skeleton className="h-6 w-16" />
                          </div>
                        ))}
                      </div>
                    ) : error ? (
                      <div className="text-center py-8">
                        <p className="text-destructive">Fout bij laden: {error}</p>
                      </div>
                    ) : (
                      <div className="rounded-2xl border bg-card overflow-hidden">
                        <Table>
                          <TableHeader>
                            <TableRow className="bg-muted/50">
                              <TableHead className="font-semibold text-sm">Rank</TableHead>
                              <TableHead className="font-semibold text-sm">Model</TableHead>
                              <TableHead className="font-semibold text-sm text-right">Score</TableHead>
                              <TableHead className="font-semibold text-sm text-right">Votes</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {leaderboardData.length > 0 ? (
                              leaderboardData.map((entry, index) => (
                                <TableRow
                                  key={`${entry.model_name}-${index}`}
                                  className="hover:bg-muted/30 transition-colors duration-200 cursor-pointer group"
                                  onClick={() => {
                                    // TODO: Open modal with model details
                                    console.log('Opening modal for:', entry.model_name);
                                  }}
                                >
                                  <TableCell className="font-medium">
                                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold text-sm">
                                      {entry.rank_position || 'N/A'}
                                    </div>
                                  </TableCell>
                                  <TableCell>
                                    <div className="space-y-1">
                                      <div className="font-medium group-hover:text-primary transition-colors duration-200">
                                        {entry.model_name}
                                      </div>
                                      {entry.organization && (
                                        <div className="text-sm text-muted-foreground">
                                          {entry.organization}
                                        </div>
                                      )}
                                    </div>
                                  </TableCell>
                                  <TableCell className="text-right font-mono font-medium">
                                    {entry.overall_score?.toFixed(0) || 'N/A'}
                                  </TableCell>
                                  <TableCell className="text-right font-mono text-muted-foreground">
                                    {entry.votes?.toLocaleString() || 'N/A'}
                                  </TableCell>
                                </TableRow>
                              ))
                            ) : (
                              <TableRow>
                                <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                                  Geen gegevens beschikbaar voor {category.label}
                                </TableCell>
                              </TableRow>
                            )}
                          </TableBody>
                        </Table>
                      </div>
                    )}
                  </TabsContent>
                ))}
              </Tabs>
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