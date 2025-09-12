import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { MobileHeader } from '@/components/MobileHeader';
import { BottomTabBar } from '@/components/BottomTabBar';
import { TabletAppShell } from '@/components/TabletAppShell';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

export default function Preferences() {
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
  const { user, preferences, updatePreferences } = useAuth();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    theme: preferences?.theme || 'system',
    locale: preferences?.locale || 'nl-NL',
    email_opt_in: preferences?.email_opt_in ?? true,
  });

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Je moet ingelogd zijn om je voorkeuren te bekijken.</p>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await updatePreferences(formData);
    } finally {
      setLoading(false);
    }
  };

  const content = (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Voorkeuren</h1>
          <p className="text-muted-foreground">
            Pas je app-instellingen en voorkeuren aan.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Uiterlijk</CardTitle>
              <CardDescription>
                Configureer hoe de app eruitziet en aanvoelt.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="theme">Thema</Label>
                <Select
                  value={formData.theme}
                  onValueChange={(value) => setFormData(prev => ({ 
                    ...prev, 
                    theme: value as 'light' | 'dark' | 'system'
                  }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Licht</SelectItem>
                    <SelectItem value="dark">Donker</SelectItem>
                    <SelectItem value="system">Systeem</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Kies je gewenste thema of gebruik de systeeminstelling.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="locale">Taal & regio</Label>
                <Select
                  value={formData.locale}
                  onValueChange={(value) => setFormData(prev => ({ 
                    ...prev, 
                    locale: value 
                  }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="nl-NL">Nederlands (Nederland)</SelectItem>
                    <SelectItem value="nl-BE">Nederlands (België)</SelectItem>
                    <SelectItem value="en-US">English (US)</SelectItem>
                    <SelectItem value="en-GB">English (UK)</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Selecteer je gewenste taal en regio-instellingen.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Communicatie</CardTitle>
              <CardDescription>
                Beheer hoe we met je communiceren.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="email_opt_in">E-mail notificaties</Label>
                  <p className="text-sm text-muted-foreground">
                    Ontvang updates over nieuwe artikelen en belangrijke AI-ontwikkelingen.
                  </p>
                </div>
                <Switch
                  id="email_opt_in"
                  checked={formData.email_opt_in}
                  onCheckedChange={(checked) => setFormData(prev => ({ 
                    ...prev, 
                    email_opt_in: checked 
                  }))}
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button type="submit" disabled={loading}>
              {loading ? 'Opslaan...' : 'Voorkeuren opslaan'}
            </Button>
          </div>
        </form>
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

      {viewType === 'mobile' ? <BottomTabBar /> : <Footer />}
    </div>
  );
}